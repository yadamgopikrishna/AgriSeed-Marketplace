import os
import json
import uuid
import re
from datetime import datetime
from config import Config

class MockCursor:
    """Cursor emulator for in-memory / JSON fallback database."""
    def __init__(self, data):
        self._data = list(data)

    def sort(self, key_or_list, direction=1):
        if isinstance(key_or_list, str):
            key = key_or_list
            reverse = (direction == -1)
        elif isinstance(key_or_list, list) and len(key_or_list) > 0:
            key, dir_val = key_or_list[0]
            reverse = (dir_val == -1)
        else:
            return self

        def sort_val(x):
            v = x.get(key)
            if v is None:
                return ""
            return v

        self._data.sort(key=sort_val, reverse=reverse)
        return self

    def limit(self, n):
        self._data = self._data[:n]
        return self

    def skip(self, n):
        self._data = self._data[n:]
        return self

    def __iter__(self):
        return iter(self._data)

    def __len__(self):
        return len(self._data)


class MockCollection:
    """Collection emulator for in-memory/JSON store supporting PyMongo API."""
    def __init__(self, name, db):
        self.name = name
        self.db = db

    def _matches(self, doc, query):
        if not query:
            return True
        for key, expected in query.items():
            if key == '$or':
                if not any(self._matches(doc, subq) for subq in expected):
                    return False
                continue
            if key == '$and':
                if not all(self._matches(doc, subq) for subq in expected):
                    return False
                continue

            val = doc.get(key)
            if isinstance(expected, dict):
                # Operator support: $regex, $in, $gte, $lte, $gt, $lt, $ne
                for op, op_val in expected.items():
                    if op == '$regex':
                        pattern = op_val
                        flags = re.IGNORECASE if expected.get('$options') == 'i' else 0
                        if not isinstance(val, str) or not re.search(pattern, val, flags):
                            return False
                    elif op == '$in':
                        if isinstance(val, list):
                            if not any(item in op_val for item in val):
                                return False
                        elif val not in op_val:
                            return False
                    elif op == '$nin':
                        if val in op_val:
                            return False
                    elif op == '$gte':
                        if val is None or float(val) < float(op_val):
                            return False
                    elif op == '$lte':
                        if val is None or float(val) > float(op_val):
                            return False
                    elif op == '$gt':
                        if val is None or float(val) <= float(op_val):
                            return False
                    elif op == '$lt':
                        if val is None or float(val) >= float(op_val):
                            return False
                    elif op == '$ne':
                        if val == op_val:
                            return False
            elif isinstance(expected, list) and isinstance(val, list):
                if not any(item in val for item in expected):
                    return False
            else:
                if val != expected:
                    return False
        return True

    def find(self, query=None, projection=None):
        query = query or {}
        items = [dict(d) for d in self.db._get_data(self.name) if self._matches(d, query)]
        return MockCursor(items)

    def find_one(self, query=None):
        query = query or {}
        for d in self.db._get_data(self.name):
            if self._matches(d, query):
                return dict(d)
        return None

    def insert_one(self, document):
        doc = dict(document)
        if '_id' not in doc:
            doc['_id'] = str(uuid.uuid4())
        if 'created_at' not in doc:
            doc['created_at'] = datetime.utcnow().isoformat()
        data = self.db._get_data(self.name)
        data.append(doc)
        self.db._save_data(self.name, data)
        
        class InsertResult:
            inserted_id = doc['_id']
        return InsertResult()

    def insert_many(self, documents):
        inserted_ids = []
        data = self.db._get_data(self.name)
        for document in documents:
            doc = dict(document)
            if '_id' not in doc:
                doc['_id'] = str(uuid.uuid4())
            if 'created_at' not in doc:
                doc['created_at'] = datetime.utcnow().isoformat()
            data.append(doc)
            inserted_ids.append(doc['_id'])
        self.db._save_data(self.name, data)
        
        class InsertManyResult:
            pass
        res = InsertManyResult()
        res.inserted_ids = inserted_ids
        return res

    def update_one(self, query, update, upsert=False):
        data = self.db._get_data(self.name)
        modified_count = 0
        matched_count = 0
        for i, doc in enumerate(data):
            if self._matches(doc, query):
                matched_count += 1
                updated_doc = dict(doc)
                if '$set' in update:
                    for k, v in update['$set'].items():
                        updated_doc[k] = v
                if '$inc' in update:
                    for k, v in update['$inc'].items():
                        updated_doc[k] = updated_doc.get(k, 0) + v
                if '$push' in update:
                    for k, v in update['$push'].items():
                        if k not in updated_doc or not isinstance(updated_doc[k], list):
                            updated_doc[k] = []
                        updated_doc[k].append(v)
                if '$pull' in update:
                    for k, v in update['$pull'].items():
                        if k in updated_doc and isinstance(updated_doc[k], list):
                            updated_doc[k] = [x for x in updated_doc[k] if x != v]
                updated_doc['updated_at'] = datetime.utcnow().isoformat()
                data[i] = updated_doc
                modified_count = 1
                break
        
        if matched_count == 0 and upsert:
            new_doc = dict(query)
            if '$set' in update:
                new_doc.update(update['$set'])
            return self.insert_one(new_doc)

        self.db._save_data(self.name, data)
        class UpdateResult:
            pass
        res = UpdateResult()
        res.matched_count = matched_count
        res.modified_count = modified_count
        return res

    def delete_one(self, query):
        data = self.db._get_data(self.name)
        deleted_count = 0
        for i, doc in enumerate(data):
            if self._matches(doc, query):
                data.pop(i)
                deleted_count = 1
                break
        self.db._save_data(self.name, data)
        class DeleteResult:
            pass
        res = DeleteResult()
        res.deleted_count = deleted_count
        return res

    def delete_many(self, query):
        data = self.db._get_data(self.name)
        new_data = [d for d in data if not self._matches(d, query)]
        deleted_count = len(data) - len(new_data)
        self.db._save_data(self.name, new_data)
        class DeleteResult:
            pass
        res = DeleteResult()
        res.deleted_count = deleted_count
        return res

    def count_documents(self, query=None):
        query = query or {}
        return sum(1 for d in self.db._get_data(self.name) if self._matches(d, query))

    def drop(self):
        self.db._save_data(self.name, [])


class FallbackMongoDatabase:
    """In-memory + JSON persisted MongoDB database fallback."""
    def __init__(self, filepath='agriseed_local_db.json'):
        self.filepath = filepath
        self._store = {}
        self._load()

    def _load(self):
        if os.path.exists(self.filepath):
            try:
                with open(self.filepath, 'r', encoding='utf-8') as f:
                    self._store = json.load(f)
            except Exception as e:
                print(f"[DB-FALLBACK] Warning loading local JSON database: {e}")
                self._store = {}

    def _persist(self):
        try:
            with open(self.filepath, 'w', encoding='utf-8') as f:
                json.dump(self._store, f, indent=2)
        except Exception as e:
            print(f"[DB-FALLBACK] Error saving local JSON database: {e}")

    def _get_data(self, collection_name):
        if collection_name not in self._store:
            self._store[collection_name] = []
        return self._store[collection_name]

    def _save_data(self, collection_name, data):
        self._store[collection_name] = data
        self._persist()

    def __getitem__(self, item):
        return MockCollection(item, self)

    def __getattr__(self, item):
        return MockCollection(item, self)

    def list_collection_names(self):
        return list(self._store.keys())


class DatabaseManager:
    """Manages MongoDB connection with transparent zero-config fallback."""
    _instance = None
    _db = None
    _is_live_mongo = False

    @classmethod
    def get_db(cls):
        if cls._db is None:
            cls.initialize()
        return cls._db

    @classmethod
    def is_live_mongo(cls):
        return cls._is_live_mongo

    @classmethod
    def initialize(cls):
        mongo_uri = Config.MONGO_URI
        db_name = Config.DB_NAME
        try:
            from pymongo import MongoClient
            import pymongo.errors
            
            client = MongoClient(mongo_uri, serverSelectionTimeoutMS=1500)
            # Test connection with a ping
            client.admin.command('ping')
            cls._db = client[db_name]
            cls._is_live_mongo = True
            print(f"[DATABASE] Connected successfully to live MongoDB at {mongo_uri} (DB: {db_name})")
        except Exception as e:
            print(f"[DATABASE] Live MongoDB unavailable ({e}). Using embedded fallback JSON/In-Memory MongoDB engine.")
            cls._db = FallbackMongoDatabase()
            cls._is_live_mongo = False

db = DatabaseManager.get_db()

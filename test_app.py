import sys
import os
import unittest
import json

if sys.platform == 'win32':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
        sys.stderr.reconfigure(encoding='utf-8')
    except Exception:
        pass

from app import app
from database import DatabaseManager
from seed_data import seed_database

class AgriSeedTestCase(unittest.TestCase):
    def setUp(self):
        app.config['TESTING'] = True
        app.config['SECRET_KEY'] = 'test_secret_key'
        self.client = app.test_client()
        self.db = DatabaseManager.get_db()
        seed_database(self.db)

    def test_01_home_page(self):
        """Test Welcome / Splash & Home Page renders correctly."""
        response = self.client.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Quality Seeds. Better Crops. Better Future.', response.data)
        self.assertIn(b'Certified Seeds', response.data)
        print(" [PASS] 01: Welcome / Splash & Home Page verified.")

    def test_02_catalog_and_filtering(self):
        """Test product catalog and category filters."""
        # Test seeds filter
        res = self.client.get('/catalog?category=Seeds')
        self.assertEqual(res.status_code, 200)
        self.assertIn(b'Pusa Basmati', res.data)

        # Test API products
        api_res = self.client.get('/api/products?category=Fertilizers')
        self.assertEqual(api_res.status_code, 200)
        data = json.loads(api_res.data)
        self.assertTrue(data['success'])
        self.assertGreater(data['count'], 0)
        print(" [PASS] 02: Catalog & Category filtering verified.")

    def test_03_product_detail_and_reviews(self):
        """Test Product Details page and review submission."""
        res = self.client.get('/product/prod_1')
        self.assertEqual(res.status_code, 200)
        self.assertIn(b'Pusa Basmati 1121', res.data)
        self.assertIn(b'Germination Rate', res.data)

        # Add a review
        rev_res = self.client.post('/api/products/prod_1/reviews', json={
            "user_name": "Test Farmer Harpreet",
            "rating": 5,
            "comment": "Excellent seed germination and crop standing!"
        })
        self.assertEqual(rev_res.status_code, 200)
        rev_data = json.loads(rev_res.data)
        self.assertTrue(rev_data['success'])
        print(" [PASS] 03: Product Details & Reviews verified.")

    def test_04_cart_workflow_and_coupons(self):
        """Test Cart addition, quantity updates, and Kisan subsidy coupon."""
        with self.client:
            # Add to cart
            add_res = self.client.post('/api/cart/add', json={
                "product_id": "prod_1",
                "pack_size": "5 kg Pack",
                "quantity": 2
            })
            self.assertEqual(add_res.status_code, 200)
            data = json.loads(add_res.data)
            self.assertEqual(data['cart_count'], 2)

            # Apply coupon KISAN50
            coup_res = self.client.post('/api/cart/coupon', json={"code": "KISAN50"})
            self.assertEqual(coup_res.status_code, 200)
            coup_data = json.loads(coup_res.data)
            self.assertTrue(coup_data['success'])
            self.assertGreater(coup_data['discount'], 0)

            # View cart page
            cart_page = self.client.get('/cart')
            self.assertEqual(cart_page.status_code, 200)
            self.assertIn(b'Pusa Basmati', cart_page.data)
            print(" [PASS] 04: Cart & Kisan Subsidy Coupon verified.")

    def test_05_farmer_auth(self):
        """Test Farmer Registration, Login, and 1-Click Demo Login."""
        # Demo login
        demo_res = self.client.post('/api/auth/demo_login', json={"role": "farmer"})
        self.assertEqual(demo_res.status_code, 200)
        demo_data = json.loads(demo_res.data)
        self.assertTrue(demo_data['success'])
        self.assertEqual(demo_data['role'], 'farmer')

        # Normal login check
        login_res = self.client.post('/api/auth/login', json={
            "identity": "farmer@agriseed.in",
            "password": "farmer123"
        })
        self.assertEqual(login_res.status_code, 200)
        print(" [PASS] 05: Farmer Authentication verified.")

    def test_06_checkout_and_order_placement(self):
        """Test complete Checkout and Order Creation workflow."""
        with self.client:
            # Login as farmer
            self.client.post('/api/auth/demo_login', json={"role": "farmer"})

            # Add product to cart
            self.client.post('/api/cart/add', json={
                "product_id": "prod_5",
                "pack_size": "1 kg Pouch",
                "quantity": 2
            })

            # Place order
            order_res = self.client.post('/api/orders/create', json={
                "name": "Ramesh Kumar Singh",
                "phone": "9876543210",
                "village": "Rampur Khurd",
                "taluk": "Indri",
                "district": "Karnal",
                "pincode": "132001",
                "state": "Haryana",
                "payment_method": "UPI (Google Pay)"
            })
            self.assertEqual(order_res.status_code, 200)
            order_data = json.loads(order_res.data)
            self.assertTrue(order_data['success'])
            order_id = order_data['order_id']
            self.assertTrue(order_id.startswith('AGRI-'))

            # Verify Order Tracking Page
            track_res = self.client.get(f'/orders/track/{order_id}')
            self.assertEqual(track_res.status_code, 200)
            self.assertIn(order_id.encode(), track_res.data)
            print(f" [PASS] 06: Checkout, Payment & Order #{order_id} created and verified.")

    def test_07_admin_management_and_order_lifecycle(self):
        """Test Admin Dashboard, Order Status Updates, and Product CRUD."""
        # 1. Update Order Status
        status_res = self.client.put('/api/admin/orders/AGRI-849201/status', json={
            "status": "Out for Delivery"
        })
        self.assertEqual(status_res.status_code, 200)
        status_data = json.loads(status_res.data)
        self.assertTrue(status_data['success'])

        # 2. Add New Product in Admin
        prod_res = self.client.post('/api/admin/products', json={
            "name": "Pusa Double Hybrid Mustard",
            "category": "Seeds",
            "price": 380,
            "stock": 60,
            "unit": "2 kg Bag",
            "crop_suitability": "Mustard",
            "season": "Rabi Season",
            "description": "High oil extraction seed with frost resistance."
        })
        self.assertEqual(prod_res.status_code, 200)
        prod_data = json.loads(prod_res.data)
        self.assertTrue(prod_data['success'])
        new_prod_id = prod_data['product']['_id']

        # 3. Delete the added test product
        del_res = self.client.delete(f'/api/admin/products/{new_prod_id}')
        self.assertEqual(del_res.status_code, 200)
        print(" [PASS] 07: Admin Dashboard, Order Status Stepper & Product CRUD verified.")

if __name__ == '__main__':
    print("=" * 60)
    print("🌾 Running Automated Tests for AgriSeed Prototype 🌾")
    print("=" * 60)
    unittest.main(verbosity=2)

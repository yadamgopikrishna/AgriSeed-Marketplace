import unittest
import json
import random
from app import app, db

class TestAgriSeedFullstackAPI(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_01_health_check(self):
        response = self.app.get('/api/health')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertTrue(data['success'])
        self.assertEqual(data['status'], 'healthy')
        print("✓ Health Check Passed (MongoDB connected)")

    def test_02_auth_registration_and_login(self):
        phone = f"98765{random.randint(10000, 99999)}"
        reg_payload = {
            "name": "Sukhdev Singh Farmer",
            "phone": phone,
            "password": "pass_farmer_123",
            "village": "Rampur Khurd",
            "district": "Karnal",
            "state": "Haryana",
            "farm_size": "8 Acres",
            "primary_crops": ["Paddy / Rice", "Wheat"]
        }
        reg_res = self.app.post('/api/auth/register', json=reg_payload)
        self.assertEqual(reg_res.status_code, 200)
        reg_data = json.loads(reg_res.data)
        self.assertTrue(reg_data['success'])
        self.assertIn('user', reg_data)
        self.assertEqual(reg_data['user']['name'], "Sukhdev Singh Farmer")
        print(f"✓ Real Farmer Registration Passed ({phone})")

        # Test Login
        login_res = self.app.post('/api/auth/login', json={
            "identity": phone,
            "password": "pass_farmer_123"
        })
        self.assertEqual(login_res.status_code, 200)
        login_data = json.loads(login_res.data)
        self.assertTrue(login_data['success'])
        self.assertEqual(login_data['user']['name'], "Sukhdev Singh Farmer")
        print(f"✓ Real Farmer Login Passed ({phone})")

    def test_03_products_catalog(self):
        res = self.app.get('/api/products')
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertTrue(data['success'])
        self.assertGreater(len(data['products']), 0)
        prod = data['products'][0]
        self.assertIn('id', prod)
        self.assertIn('name', prod)
        self.assertIn('price', prod)
        print(f"✓ Products API Passed ({len(data['products'])} items loaded)")

    def test_04_create_and_track_order(self):
        order_payload = {
            "items": [
                {
                    "id": "prod_1",
                    "productId": "prod_1",
                    "name": "Pusa Basmati 1121 Paddy Seeds",
                    "price": 850,
                    "quantity": 2,
                    "packSize": "10 kg Bag"
                }
            ],
            "subtotal": 1700,
            "discount": 170,
            "deliveryFee": 0,
            "totalAmount": 1530,
            "couponCode": "KISAN50",
            "paymentMethod": "UPI (QR Code Verification)",
            "deliveryAddress": {
                "fullName": "Baldev Singh",
                "phone": "9812345678",
                "village": "Ludhiana Rural",
                "district": "Ludhiana",
                "state": "Punjab",
                "pincode": "141001"
            }
        }
        res = self.app.post('/api/orders', json=order_payload)
        self.assertEqual(res.status_code, 200)
        data = json.loads(res.data)
        self.assertTrue(data['success'])
        order_id = data['order_id']
        self.assertTrue(order_id.startswith('AGRI-'))
        print(f"✓ Real Order Placement Passed (Order #{order_id})")

        # Track Order
        track_res = self.app.get(f'/api/orders/track/{order_id}')
        self.assertEqual(track_res.status_code, 200)
        track_data = json.loads(track_res.data)
        self.assertTrue(track_data['success'])
        self.assertEqual(track_data['order']['status'], 'Ordered')
        print(f"✓ Order Logistics Tracking Passed for #{order_id}")

        # Advance Status by Admin
        status_res = self.app.post(f'/api/admin/orders/{order_id}/status', json={"status": "Shipped"})
        self.assertEqual(status_res.status_code, 200)
        print(f"✓ Admin Order Status Update Passed for #{order_id} -> Shipped")

    def test_05_crop_doctor_diagnose(self):
        diag_res = self.app.post('/api/crop-doctor/diagnose', json={
            "sampleIndex": 0,
            "imageUrl": "https://images.unsplash.com/photo-1586201375761-83865001e31c"
        })
        self.assertEqual(diag_res.status_code, 200)
        diag_data = json.loads(diag_res.data)
        self.assertTrue(diag_data['success'])
        self.assertIn('diagnosis', diag_data)
        self.assertEqual(diag_data['diagnosis']['crop'], "Paddy / Rice")
        print("✓ AI Crop Doctor Diagnostic API Passed")

if __name__ == '__main__':
    unittest.main()

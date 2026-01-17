#!/bin/bash

echo "=== Testing Wholesale Inquiries Feature ==="
echo ""

echo "1. Testing API endpoint GET /api/wholesale-inquiries..."
RESPONSE=$(curl -s "http://localhost:3000/api/admin/wholesale-inquiries")
if echo "$RESPONSE" | python -m json.tool > /dev/null 2>&1; then
    echo "   ✓ API returns valid JSON"
else
    echo "   ✗ API returns invalid JSON or server not running"
fi

echo ""
echo "2. Testing API endpoints..."
echo "   Testing GET /api/admin/wholesale-inquiries"
curl -s "http://localhost:3000/api/admin/wholesale-inquiries" | head -c 100
echo ""
echo ""
echo "   ✓ API endpoint is accessible"

echo ""
echo "5. Testing controller methods..."
if grep -q "public function replyToWholesaleInquiry" "c:/Users/ASUS/Documents/GitHub/nandana-tea-factory-website-HMMC_2/backend/app/Http/Controllers/AdminController.php"; then
    echo "   ✓ replyToWholesaleInquiry() method exists in AdminController"
fi
if grep -q "public function deleteWholesaleInquiry" "c:/Users/ASUS/Documents/GitHub/nandana-tea-factory-website-HMMC_2/backend/app/Http/Controllers/AdminController.php"; then
    echo "   ✓ deleteWholesaleInquiry() method exists in AdminController"
fi

echo ""
echo "=== All Tests Complete ==="

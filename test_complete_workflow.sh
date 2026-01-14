#!/bin/bash

echo "=== WHOLESALE INQUIRY COMPLETE WORKFLOW TEST ==="
echo ""

# Test 1: Fetch existing inquiry
echo "1. Fetching existing wholesale inquiry..."
INQUIRY=$(curl -s "http://127.0.0.1:8000/api/wholesale-inquiries" | python -c "import sys, json; data=json.load(sys.stdin); print(json.dumps(data[0]) if data else '{}')") 
INQUIRY_ID=$(echo "$INQUIRY" | python -c "import sys, json; print(json.load(sys.stdin).get('id', 'UNKNOWN'))")
echo "   Found inquiry ID: $INQUIRY_ID"
echo "   Inquiry details:"
echo "$INQUIRY" | python -m json.tool | sed 's/^/     /'

echo ""
echo "2. Testing reply endpoint (POST)..."
# Create test reply
REPLY_RESPONSE=$(curl -s -X POST "http://127.0.0.1:8000/api/wholesale-inquiries/$INQUIRY_ID/reply" \
  -H "Content-Type: application/json" \
  -H "X-CSRF-TOKEN: " \
  -d '{"reply":"Thank you for your inquiry. We will get back to you soon."}')

echo "   Response:"
echo "$REPLY_RESPONSE" | python -m json.tool 2>/dev/null || echo "   Error or no JSON response"

echo ""
echo "3. Verifying reply was saved..."
UPDATED_INQUIRY=$(curl -s "http://127.0.0.1:8000/api/wholesale-inquiries" | python -c "import sys, json; data=json.load(sys.stdin); print(json.dumps([i for i in data if i['id'] == 1][0]) if data else '{}')") 
echo "   Updated inquiry:"
echo "$UPDATED_INQUIRY" | python -m json.tool | grep -A2 "reply" | head -5

echo ""
echo "=== WORKFLOW TEST COMPLETE ==="

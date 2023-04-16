# !/bin/bash

# Start the server in the background
node server.js &

# Store the process ID of the server process
server_pid=$!

# Test 1: Make GET request to the server
test1=$(curl -s http://localhost:3000/)
echo "
Test 1: 
$test1"

# Test 2: Make POST request to the server
test2=$(curl -s -X POST -H "Content-Type: application/json" -d '{"nickname": "asdas"}' http://localhost:3000/login)
echo "
Test 2: 
$test2"

# Test 3: Make POST request to the server with authorization header
test3=$(curl -s -X POST -H "Content-Type: application/json" -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuaWNrbmFtZSI6ImFzZGFzIiwiaWF0IjoxNjgxNjY5ODYzfQ.Ga_W8nnWqjSaoU97Yp0FyIEWgfXwew5EVqXDOEXGthQ" -d '{"nick": "klkl", "name": "Dima", "surname": "Petrov"}' http://localhost:3000/students)
echo "
Test 3: 
$test3"

toCheckResult=$(curl -s http://localhost:3000/)
echo "
Result: 
$toCheckResult"

sleep 1000

# Stop the server after tests are done
kill $server_pid
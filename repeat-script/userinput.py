# userinput.py - DIRECT ACCESS VERSION - No waiting needed!
import os

print("🔄 Direct File Access Mode")
print("📝 AI can read user_input.txt immediately - no waiting!")
print("💡 Just save your message in 'user_input.txt' before running script")
print("-" * 50)

input_file = "user_input.txt"

# Check if user_input.txt already exists (user prepared it)
if os.path.exists(input_file):
    with open(input_file, 'r', encoding='utf-8') as f:
        user_input = f.read().strip()
    
    if user_input.lower() == "stop":
        print("🛑 Stop command received")
    else:
        print(f"✅ Received: {user_input}")
        print("🤖 AI can now process this request immediately!")
        print("-" * 50)
        
        # Create processed marker
        with open("input_processed.txt", 'w', encoding='utf-8') as f:
            f.write("processed")
else:
    print("⚠️ No user_input.txt found. Please create it with your message first.")
    print("💡 The AI will read it directly - no waiting needed!")
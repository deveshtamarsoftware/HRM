# HRM DDDH

# What is an SSH Key?
An SSH (Secure Shell) key is a secure method of authenticating and connecting to a remote machine, such as a Git server, without having to use a password. It consists of two parts: a public key and a private key. The private key is kept secret on your local machine, while the public key is uploaded to the remote server. When you attempt to connect, the server uses your public key to verify that you are the owner of the corresponding private key, allowing for a secure, passwordless connection.


# Why Use SSH Keys?
Security: SSH keys are much more secure than passwords, as they are nearly impossible to guess or brute force. They also protect you from "man-in-the-middle" attacks.

Convenience: Once set up, you no longer need to enter your username and password every time you interact with the remote repository. This streamlines your workflow and saves time.

Automation: SSH keys enable scripts and automated tools to securely connect to remote servers without human intervention.

Access Control: You can easily revoke access by removing a user's public key from the server, which is more straightforward than changing a shared password.

# How to Add an SSH Key to GitHub
### Step 1: Check for Existing SSH Keys
Open your terminal or Git Bash and run the following command to see if you already have an SSH key:

Bash
ls -al ~/.ssh
If you see files named id_rsa.pub or id_ed25519.pub, you have an existing key. You can skip to Step 3. If not, proceed to Step 2.

### Step 2: Generate a New SSH Key
To generate a new SSH key, use the following command, replacing your_email@example.com with your GitHub email address:
Bash
ssh-keygen -t ed25519 -C "your_email@example.com"
ssh-keygen: The command-line tool for generating keys.

-t ed25519: Specifies the type of key to create. ed25519 is the recommended, more secure algorithm.

-C "your_email@example.com": Adds a comment to the key to help you identify it.

When prompted, press Enter to accept the default file location and an optional passphrase. A passphrase adds an extra layer of security, but you'll have to enter it each time you use the key.

### Step 3: Add the SSH Key to the SSH Agent
The SSH agent is a program that holds your keys in memory, so you don't have to enter your passphrase every time. Start the SSH agent and add your new key to it with these commands:

Bash
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519
### Step 4: Copy the Public Key
You need to copy your public key so you can add it to your GitHub account.

On macOS:
Bash
pbcopy < ~/.ssh/id_ed25519.pub

On Windows (Git Bash):
Bash
cat ~/.ssh/id_ed25519.pub
Copy the output of the cat command manually.

### Step 5: Add the Key to Your GitHub Account
Navigate to your GitHub account settings.
Click on Settings in the dropdown menu.
In the left sidebar, click on SSH and GPG keys.
Click the New SSH key button.
Give your key a descriptive title (e.g., "My Laptop" or "Work PC").
Paste the public key you copied in Step 4 into the "Key" field.
Click Add SSH key.
You will be prompted to enter your GitHub password to confirm the change.

### Step 6: Test Your Connection
To verify that everything is set up correctly, open your terminal and run the following command:

Bash
ssh -T git@github.com
You should see a message similar to "Hi your-username! You've successfully authenticated...". If you get a "permission denied" error, double-check all the previous steps.
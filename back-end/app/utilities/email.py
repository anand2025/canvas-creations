import smtplib
import os
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from typing import List, Optional

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

async def send_email(
    to_email: str,
    subject: str,
    html_content: str,
    sender_name: str = "CanvasCreations"
):
    """
    Sends an email using SMTP. 
    Settings are pulled from environment variables.
    """
    smtp_host = os.getenv("SMTP_HOST", "smtp.gmail.com")
    smtp_port = int(os.getenv("SMTP_PORT", 587))
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASS")

    if not smtp_user or not smtp_pass:
        logger.warning(f"SMTP credentials not set. Skipping email to {to_email}")
        logger.info(f"Email Content (Subject: {subject}): {html_content[:100]}...")
        return False

    msg = MIMEMultipart()
    msg["From"] = f"{sender_name} <{smtp_user}>"
    msg["To"] = to_email
    msg["Subject"] = subject

    msg.attach(MIMEText(html_content, "html"))

    try:
        # Use a context manager to ensure connection is closed
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()  # Secure the connection
            server.login(smtp_user, smtp_pass)
            server.send_message(msg)
            
        logger.info(f"Successfully sent email to {to_email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send email to {to_email}: {str(e)}")
        return False

async def send_welcome_email(email: str):
    subject = "Welcome to CanvasCreations! 🎨"
    html_content = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #FF007F; text-align: center;">Welcome to CanvasCreations!</h2>
        <p>Hi there,</p>
        <p>Thank you for subscribing to our newsletter! We're thrilled to have you in our community of art lovers.</p>
        <p>Stay tuned for our latest collections, artist spotlights, and exclusive offers.</p>
        <div style="text-align: center; margin-top: 30px; padding: 20px; background-color: #f9f9f9; border-radius: 8px;">
            <p style="margin: 0; font-weight: bold; color: #333;">ENJOY OUR ART</p>
            <p style="margin: 10px 0; font-size: 24px; color: #FFC107; font-weight: 800 italic;">CanvasCreations</p>
            <a href="http://localhost:3000/shop" style="display: inline-block; padding: 12px 24px; background-color: #FF007F; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Explore Gallery</a>
        </div>
        <p style="font-size: 12px; color: #777; margin-top: 30px; text-align: center;">
            &copy; 2026 CanvasCreations. All rights reserved.
        </p>
    </div>
    """
    return await send_email(email, subject, html_content)

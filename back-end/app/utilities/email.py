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

    logger.info(f"Attempting to send email to {to_email} via {smtp_host}:{smtp_port}")
    
    if not smtp_user or not smtp_pass:
        logger.error(f"CRITICAL: SMTP credentials not set! "
                     f"(SMTP_USER: {'Set' if smtp_user else 'MISSING'}, "
                     f"SMTP_PASS: {'Set' if smtp_pass else 'MISSING'}). "
                     f"Skipping email to {to_email}")
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

async def send_seller_welcome_email(name: str, email: str, password: str):
    subject = "Welcome to CanvasCreations - Seller Account Created"
    html_content = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #FF007F; text-align: center;">Welcome to CanvasCreations as a Seller! 🎨</h2>
        <p>Hi {name},</p>
        <p>You have been added as a seller on CanvasCreations. You can now log in and start managing your products.</p>
        <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p><strong>Login Email:</strong> {email}</p>
            <p><strong>Temporary Password:</strong> {password}</p>
        </div>
        <p>Please log in and <strong>change your password</strong> immediately for security.</p>
        <div style="text-align: center; margin-top: 30px;">
            <a href="http://localhost:3000/login" style="display: inline-block; padding: 12px 24px; background-color: #FF007F; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Login now</a>
        </div>
    </div>
    """
    return await send_email(email, subject, html_content)

async def send_password_reset_email(email: str, token: str):
    subject = "Reset Your Password - CanvasCreations 🎨"
    reset_link = f"http://localhost:3000/reset-password?token={token}"
    html_content = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #FF007F; text-align: center;">Password Reset Request</h2>
        <p>Hi there,</p>
        <p>We received a request to reset your password for your CanvasCreations account. Click the button below to set a new password:</p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="{reset_link}" style="display: inline-block; padding: 12px 24px; background-color: #FF007F; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Reset Password</a>
        </div>
        <p>This link will expire in 30 minutes. If you didn't request this, you can safely ignore this email.</p>
        <p style="font-size: 12px; color: #777; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">
            If you're having trouble clicking the button, copy and paste this URL into your web browser:<br>
            <span style="word-break: break-all; color: #007bff;">{reset_link}</span>
        </p>
    </div>
    """
    return await send_email(email, subject, html_content)

async def send_verification_email(email: str, token: str):
    subject = "Verify Your Email - CanvasCreations 🎨"
    verify_link = f"http://localhost:3000/verify-email?token={token}"
    html_content = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #FF007F; text-align: center;">Verify Your Email</h2>
        <p>Hi there,</p>
        <p>Welcome to CanvasCreations! Please click the button below to verify your email address and activate your account:</p>
        <div style="text-align: center; margin: 30px 0;">
            <a href="{verify_link}" style="display: inline-block; padding: 12px 24px; background-color: #FF007F; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Verify Email</a>
        </div>
        <p>This link will expire in 24 hours. If you didn't create an account, you can safely ignore this email.</p>
        <p style="font-size: 12px; color: #777; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">
            If you're having trouble clicking the button, copy and paste this URL into your web browser:<br>
            <span style="word-break: break-all; color: #007bff;">{verify_link}</span>
        </p>
    </div>
    """
    return await send_email(email, subject, html_content)

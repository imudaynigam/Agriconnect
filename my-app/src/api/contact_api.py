from fastapi import APIRouter
from pydantic import BaseModel
import csv
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from fastapi.responses import JSONResponse

router = APIRouter()

class ContactForm(BaseModel):
    name: str
    email: str
    message: str

@router.post("/contact")
def submit_contact(form: ContactForm):
    print("Received contact form:", form)
    csv_file = "contact_messages.csv"
    try:
        with open(csv_file, mode="a", newline='', encoding="utf-8") as file:
            writer = csv.writer(file)
            writer.writerow([form.name, form.email, form.message])
        print("Message written to CSV.")
    except Exception as e:
        print("Error writing to CSV:", e)
    # 2. Send email (configure these settings)
    sender_email = "your_email@gmail.com"  # <-- CHANGE THIS
    sender_password = "your_password"      # <-- CHANGE THIS
    receiver_email = "receiver_email@gmail.com"  # <-- CHANGE THIS
    subject = "New Contact Form Submission"
    body = f"Name: {form.name}\nEmail: {form.email}\nMessage: {form.message}"

    try:
        msg = MIMEMultipart()
        msg["From"] = sender_email
        msg["To"] = receiver_email
        msg["Subject"] = subject
        msg.attach(MIMEText(body, "plain"))

        with smtplib.SMTP_SSL("smtp.gmail.com", 465) as server:
            server.login(sender_email, sender_password)
            server.sendmail(sender_email, receiver_email, msg.as_string())
    except Exception as e:
        return JSONResponse(status_code=500, content={"message": f"Message saved, but email failed: {str(e)}"})

    return {"message": "Contact form submitted successfully."}

"""
To use this router, add the following to your main.py:

from src.api.contact_api import router as contact_router
app.include_router(contact_router)
""" 
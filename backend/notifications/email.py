import logging

from django.conf import settings
from django.core.mail import EmailMessage

logger = logging.getLogger(__name__)


def send_status_change_email(complaint, old_status, new_status):
    if not complaint.resident.email:
        return

    subject = f"Complaint #{complaint.id} status updated: {new_status}"
    body = (
        f"Hello {complaint.resident.get_full_name() or complaint.resident.username},\n\n"
        f"Your complaint \"{complaint.description[:80]}\" ({complaint.category}) "
        f"has changed status from '{old_status}' to '{new_status}'.\n\n"
        f"You can view the full history in the Society Maintenance Tracker app.\n\n"
        f"— Society Maintenance Tracker"
    )
    try:
        EmailMessage(
            subject=subject,
            body=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[complaint.resident.email],
        ).send(fail_silently=False)
    except Exception:
        logger.exception("Failed to send status-change email for complaint %s", complaint.id)


def send_important_notice_email(notice, residents_qs):
    recipients = list(residents_qs.exclude(email="").values_list("email", flat=True))
    if not recipients:
        return

    subject = f"[Important Notice] {notice.title}"
    body = f"{notice.body}\n\n— Society Maintenance Tracker"
    try:
        EmailMessage(
            subject=subject,
            body=body,
            from_email=settings.DEFAULT_FROM_EMAIL,
            to=[settings.DEFAULT_FROM_EMAIL],
            bcc=recipients,
        ).send(fail_silently=False)
    except Exception:
        logger.exception("Failed to send important-notice email for notice %s", notice.id)
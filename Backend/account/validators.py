import re
from django.core.exceptions import ValidationError

# Password Validation Criterias
def validate_password(password, email=None, username=None):
    """
    Validates the password based on length, complexity, and whether it contains the email or username.
    """
    if len(password) < 8:
        raise ValidationError("Password must be at least 8 characters.")

    if not re.search(r"[A-Z]", password):
        raise ValidationError("Password must contain at least one uppercase letter.")
    
    if not re.search(r"[a-z]", password):
        raise ValidationError("Password must contain at least one lowercase letter.")
    
    if not re.search(r"\d", password):
        raise ValidationError("Password must contain at least one number.")
    
    if not re.search(r"[@$!%*?&]", password):
        raise ValidationError("Password must contain at least one special character (@, $, !, %, *, ?, &).")
    
    if email and email in password:
        raise ValidationError("Password should not contain the email address.")
    
    if username and username in password:
        raise ValidationError("Password should not contain the username.")

    return password
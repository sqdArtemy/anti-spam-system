"""
All validator functions are defined in this file.
"""
import re


def is_email_valid(email: str) -> bool:
    email_regexp = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(email_regexp, email) is not None


def is_password_valid(password: str) -> bool:
    password_regexp = r'^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,}$'
    return re.match(password_regexp, password) is not None


def is_name_valid(name: str) -> bool:
    name_regexp = r'^[a-zA-Z\-]{2,}'
    return re.match(name_regexp, name) is not None

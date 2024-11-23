"""
This file contains all needed enumerators for this project
"""
from enum import Enum


class Messages(Enum):
    # Valued validation
    VALUE_RANGE = "Value should be in range from {} to {}"
    VALUE_POSITIVE = "Value should be > 0."
    INVALID_FILTERS = "Provided filters are invalid."
    INVALID_SORT = "Provided sorting fields are invalid"

    # Object actions
    OBJECT_NOT_FOUND = "{} with {} '{}' does not exist."
    OBJECT_DELETED = "{} has been deleted."
    OBJECT_ALREADY_EXISTS = "{} with {} '{}' already exists."

    # Auth actions
    FORBIDDEN = "You do not have permission to perform this action."
    INVALID_CREDENTIALS = "Invalid credentials."
    TOKEN_EXPIRED = "Token is expired."
    TOKEN_MISSING = "Missing token."

    # ANALYZE | WORKFLOW
    INVALID_INPUT = "Either 'text' or 'image' must be provided, not both."
    WORKFLOW_EXECUTION_ERROR = "Error executing workflow: {}"
    IMAGE_MISSING = "Image file is missing or empty."
    IMAGE_UPLOAD_ERROR = "Error uploading image to MinIO: {}"

    # VALIDATE
    VALIDATE_CONFIDENCE = "Confidence must be between 0 and 1."
    VALIDATE_IS_SUS = "is_sus must be a boolean value."

    USER_NOT_CHECK_REQUEST_CREATOR = "User is not a creator of this check request."
    ALREADY_REVIEWED = "This check_request already has a feedback."
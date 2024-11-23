"""
There are all custom exceptions that are specific for this project.
"""
from marshmallow import ValidationError


class EnvVariableError(Exception):
    def __init__(self, env_name: str):
        self.env_name = env_name

    def __str__(self) -> str:
        return f"Environment variable '{self.env_name}' is not defined."


class JWTExpiredError(Exception):
    def __init__(self):
        self.message = "Provided JWT has expired."

    def __str__(self) -> str:
        return self.message


class PermissionDeniedError(Exception):
    def __init__(self, message: str = "You do not have permission to perform this action."):
        self.message = message

    def __str__(self) -> str:
        return self.message


class InvalidInputError(ValidationError):
    """
    Custom exception for invalid input errors. Inherits from Marshmallow's ValidationError
    to ensure compatibility with validation workflows.
    """

    def __init__(self, message, *args, **kwargs):
        """
        Initialize the error with a custom message.
        :param message: The error message to be displayed.
        """
        super().__init__(message, *args, **kwargs)

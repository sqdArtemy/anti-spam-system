"""
This file contains all needed special handy functions which are used throughout the project.
"""
import os
from dotenv import load_dotenv

from utilities.exceptions import EnvVariableError


def get_env_variable(name):
    value = os.getenv(name)
    if not value:
        raise EnvVariableError(name)
    return value


def is_file_exists(file_path: str) -> bool:
    if os.path.exists(file_path):
        return True
    else:
        return False

def count_matching_sus(serialized_data, target_col = 'ai_sus'):
    count = 0

    for check_request in serialized_data:
        if check_request.get(target_col) == check_request.get('actual_sus'):
            count += 1

    return count

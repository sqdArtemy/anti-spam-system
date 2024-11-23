import json
from json import JSONDecodeError

from flask_sqlalchemy.query import Query
from marshmallow import ValidationError

from db_init import db
from utilities.enums import Messages


class FilterMixin:
    def get_filtered_query(self, query: Query, model: db.Model, filters: json, filter_mappings: dict = {}) -> Query:
        try:
            filters_dict = json.loads(filters)

            for field, value in filters_dict.items():
                if field in filter_mappings.keys():
                    filter_nested_field, field = filter_mappings.get(field)
                    query = query.filter(filter_nested_field.has(field == value))
                else:
                    query = query.filter(getattr(model, field) == value)
        except (AttributeError, JSONDecodeError):
            raise ValidationError(Messages.INVALID_FILTERS.value)

        return query
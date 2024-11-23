from flask_sqlalchemy.query import Query
from marshmallow import ValidationError

from db_init import db
from utilities.enums import Messages


class SortMixin:
    def get_sorted_query(self, query: Query, model: db.Model, sort_fields: list[str], sort_mappings: dict = {}) -> Query:
        sort_columns = []

        try:
            for field in sort_fields:
                sort_order = True

                if field[0] == '-':
                    sort_order = False
                    field = field[1:]

                column = getattr(model, field)
                if field in sort_mappings:
                    sort_model, field = sort_mappings.get(field)
                    query.join(sort_model)
                    column = field

                if not sort_order:
                    column = column.desc()

                sort_columns.append(column)
        except AttributeError:
            raise ValidationError(Messages.INVALID_SORT.value)

        return query.order_by(*sort_columns)
from flask_restful import reqparse

sort_filter_parser = reqparse.RequestParser()
sort_filter_parser.add_argument("sort_by", type=str, required=False, location="args", action="append")
sort_filter_parser.add_argument("filters", type=str, required=False, location="args")
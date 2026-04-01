from flask import Blueprint, jsonify, request

from app import db
from app.models.card import Card
from app.models.todo import Todo

todos_bp = Blueprint('todos', __name__)


@todos_bp.route('/todos', methods=['GET'])
def list_todos():
    card_id = request.args.get('card_id', type=int)
    if card_id is None:
        return jsonify({'error': 'Query parameter card_id is required'}), 400
    card = db.session.get(Card, card_id)
    if not card:
        return jsonify({'error': 'Card not found'}), 404
    todos = (
        Todo.query.filter_by(card_id=card_id)
        .order_by(Todo.created_at.asc())
        .all()
    )
    return jsonify([t.to_dict() for t in todos])


@todos_bp.route('/todos', methods=['POST'])
def create_todo():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Request body is required'}), 400
    card_id = data.get('card_id')
    text = data.get('text', '')
    if card_id is None:
        return jsonify({'error': 'card_id is required'}), 400
    if not isinstance(text, str) or not text.strip():
        return jsonify({'error': 'text is required and must be non-empty'}), 400
    card = db.session.get(Card, card_id)
    if not card:
        return jsonify({'error': 'Card not found'}), 404
    todo = Todo(card_id=card_id, text=text.strip())
    db.session.add(todo)
    db.session.commit()
    return jsonify(todo.to_dict()), 201


@todos_bp.route('/todos/<int:todo_id>', methods=['PATCH'])
def update_todo(todo_id):
    todo = db.session.get(Todo, todo_id)
    if not todo:
        return jsonify({'error': 'Todo not found'}), 404
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Request body is required'}), 400
    if 'text' in data:
        if not isinstance(data['text'], str) or not data['text'].strip():
            return jsonify({'error': 'text must be a non-empty string'}), 400
        todo.text = data['text'].strip()
    if 'done' in data:
        if not isinstance(data['done'], bool):
            return jsonify({'error': 'done must be a boolean'}), 400
        todo.done = data['done']
    if 'text' not in data and 'done' not in data:
        return jsonify({'error': 'No valid fields to update'}), 400
    db.session.commit()
    return jsonify(todo.to_dict())


@todos_bp.route('/todos/<int:todo_id>', methods=['DELETE'])
def delete_todo(todo_id):
    todo = db.session.get(Todo, todo_id)
    if not todo:
        return jsonify({'error': 'Todo not found'}), 404
    db.session.delete(todo)
    db.session.commit()
    return '', 204

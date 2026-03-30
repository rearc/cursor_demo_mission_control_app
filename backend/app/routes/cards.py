from flask import Blueprint, jsonify, request

from app import db
from app.models.card import Card

cards_bp = Blueprint('cards', __name__)


@cards_bp.route('/cards', methods=['GET'])
def list_cards():
    cards = Card.query.filter_by(is_active=True).order_by(Card.position).all()
    return jsonify([card.to_dict() for card in cards])


@cards_bp.route('/cards/<int:card_id>', methods=['GET'])
def get_card(card_id):
    card = db.get_or_404(Card, card_id)
    return jsonify(card.to_dict())


@cards_bp.route('/cards', methods=['POST'])
def create_card():
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Request body is required'}), 400

    required = ['slug', 'title', 'source']
    missing = [f for f in required if f not in data]
    if missing:
        return jsonify({'error': f'Missing required fields: {", ".join(missing)}'}), 400

    if Card.query.filter_by(slug=data['slug']).first():
        return jsonify({'error': f'Card with slug "{data["slug"]}" already exists'}), 409

    card = Card(
        slug=data['slug'],
        title=data['title'],
        description=data.get('description', ''),
        icon=data.get('icon', ''),
        source=data['source'],
        config=data.get('config', {}),
        position=data.get('position', 0),
        is_active=data.get('is_active', True),
    )
    db.session.add(card)
    db.session.commit()
    return jsonify(card.to_dict()), 201


@cards_bp.route('/cards/<int:card_id>', methods=['PUT'])
def update_card(card_id):
    card = db.get_or_404(Card, card_id)
    data = request.get_json()
    if not data:
        return jsonify({'error': 'Request body is required'}), 400

    for field in ['title', 'description', 'icon', 'source', 'config', 'layout', 'position', 'is_active']:
        if field in data:
            setattr(card, field, data[field])

    db.session.commit()
    return jsonify(card.to_dict())


@cards_bp.route('/cards/<int:card_id>', methods=['DELETE'])
def delete_card(card_id):
    card = db.get_or_404(Card, card_id)
    db.session.delete(card)
    db.session.commit()
    return jsonify({'message': f'Card "{card.slug}" deleted'})

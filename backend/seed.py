from app import create_app, db
from app.models.card import Card


def seed():
    app = create_app()
    with app.app_context():
        Card.query.delete()

        cards = [
            Card(
                slug='weather',
                title='Weather',
                description='Current weather conditions',
                icon='☀️',
                source='weather',
                config={'city': 'San Francisco'},
                layout={'x': 0, 'y': 0, 'w': 6, 'h': 4},
                position=1,
                is_active=True,
            ),
            Card(
                slug='quote',
                title='Daily Quote',
                description='Random inspirational quote',
                icon='💬',
                source='quote',
                config={},
                layout={'x': 6, 'y': 0, 'w': 6, 'h': 4},
                position=2,
                is_active=True,
            ),
            Card(
                slug='space',
                title='Space Photo',
                description='NASA Astronomy Picture of the Day',
                icon='🚀',
                source='space',
                config={},
                layout={'x': 0, 'y': 4, 'w': 6, 'h': 6},
                position=3,
                is_active=True,
            ),
            Card(
                slug='placeholder',
                title='Coming Soon',
                description='What should we build here?',
                icon='✨',
                source='placeholder',
                config={},
                layout={'x': 6, 'y': 4, 'w': 6, 'h': 6},
                position=4,
                is_active=True,
            ),
        ]

        db.session.add_all(cards)
        db.session.commit()
        print(f'Seeded {len(cards)} cards.')


if __name__ == '__main__':
    seed()

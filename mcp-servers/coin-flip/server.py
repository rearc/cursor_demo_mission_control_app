import random
from mcp.server.fastmcp import FastMCP

mcp = FastMCP("coin-flip")


@mcp.tool()
def flip_coin() -> str:
    """Flip a coin and return 'heads' or 'tails'."""
    return random.choice(["heads", "tails"])


if __name__ == "__main__":
    mcp.run()

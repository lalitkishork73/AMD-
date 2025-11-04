import logging
from logging.handlers import RotatingFileHandler
import sys
import os

LOG_DIR = "logs"
os.makedirs(LOG_DIR, exist_ok=True)

# File handler (rotating log file, 5 MB per file, 5 backups)
file_handler = RotatingFileHandler(
    filename=os.path.join(LOG_DIR, "app.log"),
    maxBytes=5*1024*1024,
    backupCount=5,
    encoding="utf-8"
)

# Console handler
console_handler = logging.StreamHandler(sys.stdout)

# Common formatter
formatter = logging.Formatter(
    "[%(asctime)s] [%(levelname)s] [%(name)s] - %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)

file_handler.setFormatter(formatter)
console_handler.setFormatter(formatter)

# Root logger setup
logging.basicConfig(
    level=logging.INFO,
    handlers=[file_handler, console_handler]
)

logger = logging.getLogger("backend-python")

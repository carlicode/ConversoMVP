import time
from icrawler.builtin import GoogleImageCrawler

# Lista de nuevas palabras clave
keywords = [
    "letra B para colorear",  # Letra B con algo que empiece con B (por ejemplo, balón)
    "letra C para colorear",  # Letra C con algo que empiece con C (por ejemplo, coche)
    "letra D para colorear",  # Letra D con algo que empiece con D (por ejemplo, delfín)
    "letra E para colorear",  # Letra E con algo que empiece con E (por ejemplo, elefante)
    "letra F para colorear",  # Letra F con algo que empiece con F (por ejemplo, flor)
    "letra G para colorear",  # Letra G con algo que empiece con G (por ejemplo, guitarra)
    "letra H para colorear",  # Letra H con algo que empiece con H (por ejemplo, helicóptero)
    "letra I para colorear",  # Letra I con algo que empiece con I (por ejemplo, iguana)
    "letra J para colorear",  # Letra J con algo que empiece con J (por ejemplo, jirafa)
    "letra K para colorear",  # Letra K con algo que empiece con K (por ejemplo, koala)
    "letra L para colorear",  # Letra L con algo que empiece con L (por ejemplo, león)
    "letra M para colorear",  # Letra M con algo que empiece con M (por ejemplo, manzana)
    "letra N para colorear",  # Letra N con algo que empiece con N (por ejemplo, nube)
    "letra O para colorear",  # Letra O con algo que empiece con O (por ejemplo, oso)
    "letra P para colorear",  # Letra P con algo que empiece con P (por ejemplo, pájaro)
    "letra Q para colorear",  # Letra Q con algo que empiece con Q (por ejemplo, queso)
    "letra R para colorear",  # Letra R con algo que empiece con R (por ejemplo, rana)
    "letra S para colorear",  # Letra S con algo que empiece con S (por ejemplo, sol)
    "letra T para colorear",  # Letra T con algo que empiece con T (por ejemplo, tigre)
    "letra U para colorear",  # Letra U con algo que empiece con U (por ejemplo, unicornio)
    "letra V para colorear",  # Letra V con algo que empiece con V (por ejemplo, vaca)
    "letra W para colorear",  # Letra W con algo que empiece con W (por ejemplo, walabi)
    "letra X para colorear",  # Letra X con algo que empiece con X (por ejemplo, xilófono)
    "letra Y para colorear",  # Letra Y con algo que empiece con Y (por ejemplo, yate)
    "letra Z para colorear",  # Letra Z con algo que empiece con Z (por ejemplo, zebra)
]


# Ruta base para guardar las imágenes
base_root = '/Users/carli.code/Downloads/Dibujos/'

# Crear un crawler para cada keyword
for keyword in keywords:
    print(f"Descargando imágenes para: {keyword}")
    # Crear una carpeta específica para cada palabra clave
    root = base_root + keyword.replace(" ", "_")
    crawler = GoogleImageCrawler(storage={"root_dir": root})
    # Ejecutar la búsqueda y descarga
    crawler.crawl(keyword=keyword, max_num=20)
    # Descansar 5 segundos antes de la siguiente búsqueda
    time.sleep(5)

print("Descarga completada.")
### Convertisseur

Pour le convertisseur, on partira sur un singleton. L'objectif ici est d'avoir qu'une seule instance de classe.
Elle s'occupera de toute la logique de conversion et d'appels API.
On délègue les responsabilités à une seule et unique classe et son unique instance. On garantit une cohérence,
une centralisation et des performances.

### Note taking

Pour l'application de prise de note, on partira sur l'Observer. La logique ici est d'observer des changements
d'états et de s'adapter en fonction. C'est la philosophie de base qui est utilisée lors du projet.
Le design pattern s'adapte particulièrement pour des interfaces réactives et c'est ceux vers quoi les contraintes
amenaient. La logique de gestion d'état est bien séparée de l'UI mais restent synchronisés.

### Adding a new Entity

1. Create a class in the **entities/** folder.
You can choose to extend GraphicsEntity if you want a general purpose graphical entity.
For entities that should follow the grid, extend PawnEntity. 

    **All entities must derive from GraphicsEntity!**

2. Create a factory function in **entities/factories/**. Currently all are located in **entities/factories/entity_factories.js**.

3. Register the factory function in **manifests/entity_manifest.js**. Along with the factory function you should give a typeName, which is used when Graphicshandler's createEntity is called.

4. If you want your entity to have graphical elements you must also create skins for it, one for each theme that exists. See the section on adding new skins for more information.

### Adding a new Animation

1. Create a class in the **animations/** folder.

2. Create a factory function in **animations/factories/**. Currently all are located in **animations/factories/animation_factories.js**.

3. Register the factory function in **manifests/animation_manifest.js**. Along with the factory function you should give a typeName, which is used to refer which animation should be played. The compatibleEntities list defines all entities that can play the animation. An empty list means all entities can play it.


### Adding a new Skin

1. Create a factory function in **entity_skins/factories/**. Currently all are located in **entity_skins/factories/entity_skin_factories.js**.

2. Register the factory function in **manifests/skin_manifest.js**. Along with the factory function you should give a typeName, which is is used to refer to the skin. Along with it you should define a theme, used when a user switches between themes. For example, currently the two themes are "bunny" and "robot".

3. Register skins that are used on a same type of object in SKIN_BUNDLES in **skin_manifest.js**. This is used when creating an entity.
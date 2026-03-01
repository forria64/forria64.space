/// <reference path="../pb_data/types.d.ts" />

/**
 * initial_schema.js — The founding document.
 *
 * Creates the `posts` collection the first time PocketBase wakes up,
 * so you can start broadcasting into the void from the admin panel
 * without clicking through a single setup wizard.
 *
 * PocketBase remembers which migrations it has already run,
 * so this only fires once. Your data survives rebuilds.
 *
 * Fields:
 *   title     — text, required — the headline screamed in red
 *   slug      — text, required, unique — the URL-friendly name for deep links
 *   content   — text, required — the raw transmission body
 *   published — bool — false = draft rotting in the void, true = live on the wire
 *   created   — autodate — stamped on birth, never touched again
 *   updated   — autodate — stamped every time you nudge a comma
 */

migrate(
  (app) => {
    const collection = new Collection({
      name: 'posts',
      type: 'base',
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'slug',
          type: 'text',
          required: true,
        },
        {
          name: 'content',
          type: 'text',
          required: true,
        },
        {
          name: 'published',
          type: 'bool',
        },
        {
          name: 'created',
          type: 'autodate',
          onCreate: true,
          onUpdate: false,
        },
        {
          name: 'updated',
          type: 'autodate',
          onCreate: true,
          onUpdate: true,
        },
      ],
      indexes: ['CREATE UNIQUE INDEX idx_posts_slug ON posts (slug)'],
      listRule: '@request.auth.id != "" || published = true',
      viewRule: '@request.auth.id != "" || published = true',
      createRule: '@request.auth.id != ""',
      updateRule: '@request.auth.id != ""',
      deleteRule: '@request.auth.id != ""',
    })

    app.save(collection)
  },
  (app) => {
    const collection = app.findCollectionByNameOrId('posts')
    app.delete(collection)
  },
)

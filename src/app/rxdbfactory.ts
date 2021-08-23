import {
  Injectable,
  isDevMode
} from '@angular/core';

// import typings
import {
  RxHeroDocument,
  RxHeroesDatabase,
  RxHeroesCollections,
  RxHeroDocumentType
} from './RxDB.d';

/**
 * Instead of using the default rxdb-import,
 * we do a custom build which lets us cherry-pick
 * only the modules that we need.
 * A default import would be: import RxDB from 'rxdb';
 */
import {
  createRxDatabase,
  addRxPlugin
} from 'rxdb/plugins/core';

import {
  addPouchPlugin, getRxStoragePouch
} from 'rxdb/plugins/pouchdb';

import { RxDBNoValidatePlugin } from 'rxdb/plugins/no-validate';
import { RxDBValidatePlugin } from 'rxdb/plugins/validate';
import { RxDBLeaderElectionPlugin } from 'rxdb/plugins/leader-election';
import { HERO_SCHEMA } from './schemas/hero.schema';
import * as PouchdbAdapterIdb from 'pouchdb-adapter-idb';

//import {
//  COUCHDB_PORT,
//  HERO_COLLECTION_NAME,
//  DATABASE_NAME,
//  IS_SERVER_SIDE_RENDERING
//} from '../../shared';


const collectionSettings = {
  ['hero']: {
    schema: HERO_SCHEMA,
    methods: {
      hpPercent(this: RxHeroDocument): number {
        return this.hp / this.maxHP * 100;
      }
    },
    sync: true
  }
};
/**
 * Loads RxDB plugins
 */
async function loadRxDBPlugins(): Promise<void> {


  //addRxPlugin(RxDBReplicationCouchDBPlugin);
  //// http-adapter is always needed for replication with the node-server
  //addPouchPlugin(PouchdbAdapterHttp);

  //if (IS_SERVER_SIDE_RENDERING) {
  //  // for server side rendering, import the memory adapter
  //  const PouchdbAdapterMemory = require('pouchdb-adapter-' + 'memory');
  //  addPouchPlugin(PouchdbAdapterMemory);
  //} else {
  // else, use indexeddb
  addPouchPlugin(PouchdbAdapterIdb);

  // then we also need the leader election
  addRxPlugin(RxDBLeaderElectionPlugin);
  addRxPlugin(RxDBValidatePlugin);
  //}


  /**
   * to reduce the build-size,
   * we use some modules in dev-mode only
   */
  //if (isDevMode()) {
  //  await Promise.all([

  //    // add dev-mode plugin
  //    // which does many checks and add full error-messages
  //    import('rxdb/plugins/dev-mode').then(
  //      module => addRxPlugin(module as any)
  //    ),

  //    // we use the schema-validation only in dev-mode
  //    // this validates each document if it is matching the jsonschema
  //    import('rxdb/plugins/validate').then(
  //      module => addRxPlugin(module as any)
  //    )
  //  ]);
  //} else {
  //  // in production we use the no-validate module instead of the schema-validation
  //  // to reduce the build-size
  //  addRxPlugin(RxDBNoValidatePlugin);
  //}

}

/**
 * creates the database
 */
async function _create(): Promise<RxHeroesDatabase> {

  await loadRxDBPlugins();

  console.log('DatabaseService: creating database..');
  const db = await createRxDatabase<RxHeroesCollections>({
    name: 'db',
    storage: getRxStoragePouch('idb'),
    // multiInstance: !IS_SERVER_SIDE_RENDERING
    // password: 'myLongAndStupidPassword' // no password needed
  });
  console.log('DatabaseService: created database');
  // write to window for debugging
  (window as any)['db'] = db;



  // create collections
  console.log('DatabaseService: create collections');
  await db.addCollections(collectionSettings);



  // sync with server

  console.log('DatabaseService: created');

  return db;
}


let initState: null | Promise<any> = null;;
let DB_INSTANCE: RxHeroesDatabase;

/**
 * This is run via APP_INITIALIZER in app.module.ts
 * to ensure the database exists before the angular-app starts up
 */
export async function initDatabase() {
  /**
   * When server side rendering is used,
   * The database might already be there
   */
  if (!initState) {
    console.log('initDatabase()');
    initState = _create().then(db => DB_INSTANCE = db);
  }
  await initState;
}

@Injectable()
export class DatabaseService {
  get db(): RxHeroesDatabase {
    return DB_INSTANCE;
  }
}

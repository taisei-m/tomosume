import * as firebase from '@firebase/testing'
import * as fs from 'fs'

const projectID = 'firestore-test'
const rulesFilePath = 'firestore.rules'

// user情報への参照
// const usersRef = (db: firebase.firestore.Firestore) => db.collection('userList')

describe(projectID, () => {
    // 初めに記述したセキュリティルールの読み込みを行う
    beforeAll(async () => {
        await firebase.loadFirestoreRules({
            projectId: projectID,
            rules: fs.readFileSync(rulesFilePath, 'utf8')
        });
    }),

    afterEach(async () => {
        await firebase.clearFirestoreData({ projectId: projectID})
    });
    afterAll(async () => {
        await Promise.all(firebase.apps().map(app => app.delete()))
    });

    describe('users collection tests', () => {
        describe('read', () => {
            test('should let anyone read any profile', async () => {
                const db = authedApp()
                const user = db.collection('users').doc('alice')
                await firebase.assertSucceeds(user.get())
            })
        })
    })
    function authedApp(auth?: object): firebase.firestore.Firestore {
        return firebase
        .initializeTestApp({ projectId: projectID, auth: auth })
        .firestore()
    }
});

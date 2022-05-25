import { Post } from 'src/app/models/post';
import { Comment } from 'src/app/models/comment';

export class TestData {

    static getComments(): Promise<Comment[]> {
        return Promise.resolve([
            {
                id: '1',
                userAccountId: '',
                username: 'kinoro',
                text: 'This is a comment',
                postId: 'a1b2c3d4e51',
                commentedAt: new Date('2021-01-01'),
                subComments: [
                    {
                        id: '11',
                        userAccountId: '',
                        username: 'mattius',
                        text: 'This is a reply',
                        postId: 'a1b2c3d4e51',
                        commentedAt: new Date('2020-01-02'),
                        subComments: [
                            {
                                id: '111',
                                userAccountId: '',
                                username: 'kinoro',
                                text: 'This is a reply to a reply',
                                postId: 'a1b2c3d4e51',
                                commentedAt: new Date('2020-01-09'),
                                subComments: []
                            },
                        ]
                    },
                ]
            },
            {
                id: '2',
                userAccountId: '',
                username: 'kgruss',
                text: 'This is another comment. http://www.drawpool.com',
                postId: 'a1b2c3d4e51',
                commentedAt: new Date('2020-10-01'),
                subComments: []
            },
            {
                id: '3',
                userAccountId: '',
                username: 'kgruss',
                text: 'This is another comment again',
                postId: 'a1b2c3d4e51',
                commentedAt: new Date('2020-10-01'),
                subComments: []
            }
        ]);
    }

    static getPosts(): Promise<Post[]> {
        return Promise.resolve([
            {
                id: 'a1b2c3d4e51',
                details: 'DrawPool is a new website I have built with my partner Matt. It is a drawing social network that is currently in development. www.drawpool.com',
                publishDate: new Date(),
                userAccountId: 'abc123',
                username: 'KgRuss',
                title: 'Do you like the landing page for my new drawing social network DrawPool?',
                tags: ['webdev','indie'],
                contentType: 20, // Link
                linkUrl: 'https://www.drawpool.com',
                imageUrl: 'https://www.drawpool.com/assets/drawpool-icon-512.png',
                numVotes: 2119,
                numComments: 39,
                options: [
                    {
                        id: 1,
                        contentType: 0,
                        text: 'Yes',
                        numVotes: 300
                    },
                    {
                        id: 2,
                        contentType: 0,
                        text: 'No',
                        numVotes: 300
                    },
                    {
                        id: 3,
                        contentType: 0,
                        text: 'Yes2',
                        numVotes: 300
                    },
                    {
                        id: 4,
                        contentType: 0,
                        text: 'No2',
                        numVotes: 300
                    },
                    {
                        id: 5,
                        contentType: 0,
                        text: 'No3',
                        numVotes: 300
                    }
                ]
            },
            {
                id: 'a1b2c3d4e59',
                publishDate: new Date(),
                userAccountId: 'def456',
                username: 'mattius',
                title: 'Who is your favourite comedian from this amazing selection?',
                contentType: 0,
                linkUrl: null,
                imageUrl: null,
                numVotes: 1522,
                numComments: 26,
                options: [
                    {
                        id: 1,
                        contentType: 20,
                        text: 'Billy Connolly',
                        linkUrl: 'https://www.youtube.com/watch?v=uPxKW7RR7h0',
                        imageUrl: 'https://img.youtube.com/vi/uPxKW7RR7h0/0.jpg',
                        numVotes: 300
                    },
                    {
                        id: 2,
                        contentType: 20,
                        text: 'Peter Kay',
                        linkUrl: 'https://www.youtube.com/watch?v=lWd0jh6PufY',
                        imageUrl: 'https://img.youtube.com/vi/lWd0jh6PufY/0.jpg',
                        numVotes: 300
                    },
                    {
                        id: 3,
                        contentType: 20,
                        text: 'Lee Evans',
                        linkUrl: 'https://www.youtube.com/watch?v=ieWzk5RLvyA',
                        imageUrl: 'https://img.youtube.com/vi/ieWzk5RLvyA/0.jpg',
                        numVotes: 300
                    },
                    {
                        id: 4,
                        contentType: 20,
                        text: 'Michael McIntyre',
                        linkUrl: 'https://www.youtube.com/watch?v=iqHuvmAGA40',
                        imageUrl: 'https://img.youtube.com/vi/iqHuvmAGA40/0.jpg',
                        numVotes: 300
                    },
                ]
            },
            {
                id: 'a1b2c3d4e58',
                publishDate: new Date(),
                userAccountId: 'ddd444',
                username: 'kinoro',
                title: 'What do you think of this drawing I did of deadpool?',
                contentType: 10,
                linkUrl: null,
                hasUserVoted: true,
                imageUrl: 'https://s3.eu-west-2.amazonaws.com/drawpool-images/Mattius/e7ad1749-b478-4cfa-96b5-4fc228a8fa07',
                numVotes: 75,
                numComments: 12,
                options: [
                    {
                        id: 1,
                        contentType: 0,
                        text: 'LOVE',
                        numVotes: 60
                    },
                    {
                        id: 2,
                        contentType: 0,
                        text: 'Meh...',
                        numVotes: 5,
                        hasUserVoted: true
                    },
                    {
                        id: 3,
                        contentType: 0,
                        text: 'HATE',
                        numVotes: 10
                    }
                ]
            },
            {
                id: 'a1b2c3d4e57',
                publishDate: new Date(),
                userAccountId: 'ddd444',
                username: 'kinoro',
                title: 'Here\'s a trailer I made for Hello Human (iOS/Android). What do you like most about it?',
                contentType: 20,
                linkUrl: 'https://www.youtube.com/watch?v=Vd79K8o095g',
                imageUrl: 'https://img.youtube.com/vi/Vd79K8o095g/0.jpg',
                numVotes: 14,
                numComments: 2,
                options: [
                    {
                        id: 1,
                        contentType: 0,
                        text: 'Great idea + trailer!',
                        numVotes: 60
                    },
                    {
                        id: 2,
                        contentType: 0,
                        text: 'It sucks :(',
                        numVotes: 5
                    },
                    {
                        id: 3,
                        contentType: 0,
                        text: 'Could be better...',
                        numVotes: 10
                    },
                    {
                        id: 3,
                        contentType: 0,
                        text: 'Other - read my comment',
                        numVotes: 10
                    }
                ]
            },
            {
                id: 'a1b2c3d4e56',
                publishDate: new Date(),
                userAccountId: 'ffgg55',
                username: 'slackAdmin',
                title: 'Which icon do you prefer for my new chat appliction Slack?',
                contentType: 0,
                linkUrl: null,
                imageUrl: null,
                numVotes: 11,
                numComments: 1,
                options: [
                    {
                        id: 1,
                        contentType: 10,
                        imageUrl: 'https://cdn.iconscout.com/icon/free/png-256/slack-226533.png',
                        numVotes: 60
                    },
                    {
                        id: 2,
                        contentType: 10,
                        imageUrl: 'https://image.flaticon.com/icons/png/512/2111/2111615.png',
                        numVotes: 60
                    },
                ]
            }
        ]);
    }
}

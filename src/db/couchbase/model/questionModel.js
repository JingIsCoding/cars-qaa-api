import client from '../client'

const Base = ottoman.model('Question', {
    id: { type:'string', auto:'uuid', readonly:true },
    createTime: { type:'string', default:new Date().toISOString() },
    modifiedTime: { type:'string', default:new Date().toISOString() },
    title: 'string',
    friendlyUrl: 'string',
    views: 'number',
    content: 'string',
    userId: {ref: 'string'},
    answer: {ref: ['Answer']},
    tags: {type:['string']}
},{
    index: {
        findById: {            // ← refdoc index
            by: 'id',
            type: 'refdoc'
        },
        findByUser: {                 // ← refdoc index
            by: 'userId',
            type: 'refdoc'
        },
        findByModifiedTime: {             // ← secondary index
            by: 'modifiedTime'
        },
        findByKeywords: {
            by: 'content'
        },
        findByTags: {              // ← secondary index
            by: 'tags'
        }
    }
});

class Question extends Base{

}

export default Question
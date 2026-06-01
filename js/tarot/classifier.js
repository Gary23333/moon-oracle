// 月影决策屋 - 问题分类器

const QUESTION_CATEGORIES = [
    { id:'love',     icon:'💕', name:'情感姻缘', placeholder:'请描述你的感情困惑...', subQuestions:['你们目前是什么关系？','你想了解你自己的感受还是对方的想法？'] },
    { id:'career',   icon:'💼', name:'事业前程', placeholder:'请描述你的事业问题...', subQuestions:['你现在的工作是什么类型？','你是在考虑跳槽还是想了解发展？'] },
    { id:'wealth',   icon:'💰', name:'财运理财', placeholder:'请描述你的财务问题...', subQuestions:['你想了解投资还是日常财运？'] },
    { id:'study',    icon:'📚', name:'学业考试', placeholder:'请描述你的学业问题...', subQuestions:['你是在备考还是想了解学业发展？'] },
    { id:'health',   icon:'🏥', name:'健康身心', placeholder:'请描述你的健康问题...', subQuestions:['你想了解身体还是心理健康？'] },
    { id:'decision', icon:'🧭', name:'人生抉择', placeholder:'请描述你面临的抉择...', subQuestions:['你有几个选项？','最让你纠结的是什么？'] },
    { id:'daily',    icon:'✨', name:'每日指引', placeholder:'今天想问什么？', subQuestions:[] },
    { id:'custom',   icon:'✏️', name:'其他问题', placeholder:'请描述你的具体问题...', subQuestions:[] }
];

function getCategoryById(id) {
    return QUESTION_CATEGORIES.find(c => c.id === id) || QUESTION_CATEGORIES[7];
}

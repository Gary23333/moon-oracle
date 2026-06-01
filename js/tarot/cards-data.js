// 月影决策屋 - 78张塔罗牌完整数据

const TAROT_IMAGE_FILES = [
    'RWS_Tarot_00_Fool.jpg','RWS_Tarot_01_Magician.jpg','RWS_Tarot_02_High_Priestess.jpg',
    'RWS_Tarot_03_Empress.jpg','RWS_Tarot_04_Emperor.jpg','RWS_Tarot_05_Hierophant.jpg',
    'RWS_Tarot_06_Lovers.jpg','RWS_Tarot_07_Chariot.jpg','RWS_Tarot_08_Strength.jpg',
    'RWS_Tarot_09_Hermit.jpg','RWS_Tarot_10_Wheel_of_Fortune.jpg','RWS_Tarot_11_Justice.jpg',
    'RWS_Tarot_12_Hanged_Man.jpg','RWS_Tarot_13_Death.jpg','RWS_Tarot_14_Temperance.jpg',
    'RWS_Tarot_15_Devil.jpg','RWS_Tarot_16_Tower.jpg','RWS_Tarot_17_Star.jpg',
    'RWS_Tarot_18_Moon.jpg','RWS_Tarot_19_Sun.jpg','RWS_Tarot_20_Judgement.jpg',
    'RWS_Tarot_21_World.jpg',
    // 小阿卡纳 - 权杖
    'Wands01.jpg','Wands02.jpg','Wands03.jpg','Wands04.jpg','Wands05.jpg',
    'Wands06.jpg','Wands07.jpg','Wands08.jpg','Wands09.jpg','Wands10.jpg',
    'Wands11.jpg','Wands12.jpg','Wands13.jpg','Wands14.jpg',
    // 小阿卡纳 - 圣杯
    'Cups01.jpg','Cups02.jpg','Cups03.jpg','Cups04.jpg','Cups05.jpg',
    'Cups06.jpg','Cups07.jpg','Cups08.jpg','Cups09.jpg','Cups10.jpg',
    'Cups11.jpg','Cups12.jpg','Cups13.jpg','Cups14.jpg',
    // 小阿卡纳 - 宝剑
    'Swords01.jpg','Swords02.jpg','Swords03.jpg','Swords04.jpg','Swords05.jpg',
    'Swords06.jpg','Swords07.jpg','Swords08.jpg','Swords09.jpg','Swords10.jpg',
    'Swords11.jpg','Swords12.jpg','Swords13.jpg','Swords14.jpg',
    // 小阿卡纳 - 星币
    'Pents01.jpg','Pents02.jpg','Pents03.jpg','Pents04.jpg','Pents05.jpg',
    'Pents06.jpg','Pents07.jpg','Pents08.jpg','Pents09.jpg','Pents10.jpg',
    'Pents11.jpg','Pents12.jpg','Pents13.jpg','Pents14.jpg'
];

const TAROT_CARDS = [
    // ===== 大阿卡纳 (22张) =====
    {id:0,name:'愚者',nameEn:'The Fool',arcana:'major',suit:null,number:0,element:'风',planet:'天王星',
     symbol:'🃏',
     uprightKeywords:['新开始','冒险','纯真','自由','无限可能'],
     reversedKeywords:['鲁莽','缺乏计划','盲目乐观','冒失'],
     uprightMeaning:'愚者代表着新旅程的开始，纯真的信任和无限的可能性。他站在悬崖边缘，却毫不畏惧，因为他相信宇宙会接住他。正位的愚者鼓励你拥抱未知，以开放的心态迎接新的冒险。',
     reversedMeaning:'逆位的愚者提醒你可能过于鲁莽行事，缺乏充分的计划和准备。在做出重大决定前需要更加谨慎，避免盲目乐观导致的失误。',
     imageDesc:'一位年轻人站在悬崖边缘，身后是灿烂的阳光。他手持白玫瑰，背着简单的行囊，一只小白狗在脚边跳跃。他仰望天空，脸上带着纯真的微笑。',
     archetype:'天真者',advice:'拥抱新的开始，相信你的直觉，但也要注意脚下的路。'},
    
    {id:1,name:'魔术师',nameEn:'The Magician',arcana:'major',suit:null,number:1,element:'风',planet:'水星',
     symbol:'🎩',
     uprightKeywords:['创造力','意志力','掌控','技能','资源充沛'],
     reversedKeywords:['操控','欺骗','能力不足','缺乏行动'],
     uprightMeaning:'魔术师象征着将想法变为现实的力量。他拥有所有元素的工具，能够将天上的能量引导到地上。正位的魔术师告诉你，你拥有实现目标所需的一切资源和技能。',
     reversedMeaning:'逆位的魔术师可能暗示能力被误用，或者你正在欺骗自己和他人。也可能是你还没有充分发挥自己的潜力。',
     imageDesc:'一位身穿红白长袍的人站在桌前，桌上摆放着权杖、圣杯、宝剑和星币。他一手举向天空，一手指向大地，头顶有无限符号。',
     archetype:'创造者',advice:'你拥有实现梦想的一切资源，现在是采取行动的时候。'},
    
    {id:2,name:'女祭司',nameEn:'High Priestess',arcana:'major',suit:null,number:2,element:'水',planet:'月亮',
     symbol:'🌙',
     uprightKeywords:['直觉','内在智慧','神秘','耐心等待','潜意识'],
     reversedKeywords:['忽视直觉','秘密揭露','情绪波动','表面化'],
     uprightMeaning:'女祭司坐在明暗两柱之间，守护着隐藏的知识。她提醒你倾听内心的声音，信任你的直觉。有些答案不需要刻意寻找，它们会在安静中自然浮现。',
     reversedMeaning:'逆位的女祭司暗示你可能正在忽视自己的直觉，或者过于依赖理性分析。也可能表示隐藏的秘密即将浮出水面。',
     imageDesc:'一位庄严的女性坐在两根柱子之间，身着蓝白长袍，手持卷轴。她身后是一道帷幕，上面绣着石榴和棕榈。满月在她脚下。',
     archetype:'直觉者',advice:'安静下来，倾听你内心深处的声音。答案就在你心中。'},
    
    {id:3,name:'女皇',nameEn:'The Empress',arcana:'major',suit:null,number:3,element:'土',planet:'金星',
     symbol:'👑',
     uprightKeywords:['丰饶','母性','创造','孕育','感官享受'],
     reversedKeywords:['依赖他人','创造力受阻','过度溺爱','忽视自我'],
     uprightMeaning:'女皇是大地之母的化身，象征着丰饶、创造和生命的孕育。她提醒你与自然连接，滋养你的身心灵。这是一个充满创造力和丰盛的时期。',
     reversedMeaning:'逆位的女皇可能暗示创造力的枯竭，或者过度依赖他人来获得满足感。也可能表示需要更多地关注自己的需求。',
     imageDesc:'一位美丽的女性坐在户外的软垫上，周围是茂盛的森林和麦田。她身穿印有石榴图案的长袍，头戴十二星冠冕，手持权杖。',
     archetype:'养育者',advice:'滋养你的创造力，与自然连接，享受生命的丰盛。'},
    
    {id:4,name:'皇帝',nameEn:'The Emperor',arcana:'major',suit:null,number:4,element:'火',planet:'白羊座',
     symbol:'🏛️',
     uprightKeywords:['权威','秩序','稳定','纪律','父性力量'],
     reversedKeywords:['专制','过度控制','僵化固执','缺乏纪律'],
     uprightMeaning:'皇帝代表着结构、秩序和稳定的权威。他用理性和纪律建立坚固的基础。正位的皇帝鼓励你用坚定的意志和清晰的规则来掌控局面。',
     reversedMeaning:'逆位的皇帝可能暗示过度控制或专制，也可能表示缺乏必要的纪律和结构。需要在权威和灵活之间找到平衡。',
     imageDesc:'一位威严的男性坐在石制宝座上，宝座装饰着四个羊头。他身穿红袍，手持权杖和圆球。身后是巍峨的山脉。',
     archetype:'统治者',advice:'建立清晰的结构和规则，用坚定的意志引领方向。'},
    
    {id:5,name:'教皇',nameEn:'The Hierophant',arcana:'major',suit:null,number:5,element:'土',planet:'金牛座',
     symbol:'⛪',
     uprightKeywords:['传统','信仰','精神指引','良师益友','学习'],
     reversedKeywords:['教条束缚','叛逆非传统','质疑权威','独立思考'],
     uprightMeaning:'教皇是精神世界的导师，代表着传统智慧和信仰体系的传承。他提醒你向有经验的人学习，遵循经过时间验证的道路。',
     reversedMeaning:'逆位的教皇可能暗示你需要质疑传统，走自己的路。或者你正被某些教条所束缚，需要更开放的思维。',
     imageDesc:'一位宗教领袖坐在两根灰色柱子之间，头戴三重冠冕，身穿红白长袍。他右手举起祝福的手势，两把钥匙交叉在他脚下。两个信徒跪在他面前。',
     archetype:'导师',advice:'向有智慧的人学习，但也要保持独立思考的能力。'},
    
    {id:6,name:'恋人',nameEn:'The Lovers',arcana:'major',suit:null,number:6,element:'风',planet:'双子座',
     symbol:'💕',
     uprightKeywords:['爱情选择','和谐结合','价值观','灵魂连接','吸引力'],
     reversedKeywords:['关系失衡','选择困难','价值观冲突','不和谐'],
     uprightMeaning:'恋人牌不仅代表爱情，更代表着重要的选择和价值观的对齐。天使在上方祝福，暗示这是命运引导的连接。正位鼓励你跟随内心做出真诚的选择。',
     reversedMeaning:'逆位的恋人可能暗示关系中的不平衡，或者你在面临选择时感到困惑。需要重新审视你的价值观和优先级。',
     imageDesc:'天使拉斐尔在云端展开双臂祝福下方的男女。女人身后是知识之树，男人身后是生命之树。太阳在天使上方闪耀。',
     archetype:'爱人',advice:'跟随你的心，做出与你价值观一致的选择。'},
    
    {id:7,name:'战车',nameEn:'The Chariot',arcana:'major',suit:null,number:7,element:'水',planet:'巨蟹座',
     symbol:'⚔️',
     uprightKeywords:['意志胜利','克服障碍','坚定前行','掌控局势'],
     reversedKeywords:['失去方向','攻击性强','失控偏航','缺乏动力'],
     uprightMeaning:'战车牌象征着通过坚定的意志力克服障碍，取得胜利。驾驭者用内在的力量统一了对立的力量，向着目标坚定前行。',
     reversedMeaning:'逆位的战车可能暗示你失去了方向感，或者力量被分散。也可能表示过度的攻击性导致了失控。',
     imageDesc:'一位铠甲战士站在战车上，头顶有星星华盖。前方是一黑一白两只狮身人面兽拉着战车。城市在他身后渐远。',
     archetype:'战士',advice:'集中你的意志力，坚定地朝着目标前进。'},
    
    {id:8,name:'力量',nameEn:'Strength',arcana:'major',suit:null,number:8,element:'火',planet:'狮子座',
     symbol:'🦁',
     uprightKeywords:['内在勇气','温柔坚韧','自我克制','以柔克刚'],
     reversedKeywords:['自我怀疑','缺乏自信','暴力冲动','恐惧'],
     uprightMeaning:'力量牌展现的不是蛮力，而是温柔的力量。女人轻轻合上狮子的嘴，象征着以柔克刚的智慧。这提醒你真正的力量来自内心的平静和自信。',
     reversedMeaning:'逆位的力量可能暗示自我怀疑或缺乏自信。也可能表示你正在与内心的恐惧和冲动作斗争。',
     imageDesc:'一位白衣女性温柔地抚摸着一头狮子的下巴。她头顶有无限符号，周围是花环。狮子看起来温顺而信任。',
     archetype:'驯服者',advice:'用温柔和耐心去面对挑战，真正的力量来自内心。'},
    
    {id:9,name:'隐者',nameEn:'The Hermit',arcana:'major',suit:null,number:9,element:'土',planet:'处女座',
     symbol:'🏔️',
     uprightKeywords:['内省','独处','智慧','精神追求','指引之光'],
     reversedKeywords:['过度孤立','逃避现实','固执己见','拒绝帮助'],
     uprightMeaning:'隐者手持灯笼，独自站在山巅，寻找内在的真理。他提醒你有时候需要独处和内省，才能找到真正的方向和智慧。',
     reversedMeaning:'逆位的隐者可能暗示过度的孤立，或者你在用独处来逃避现实。也可能表示你需要更多地与他人分享你的智慧。',
     imageDesc:'一位灰袍老者独自站在雪山之巅，手持一盏六芒星灯笼。他拄着长杖，低头沉思。周围是寂静的雪景。',
     archetype:'智者',advice:'给自己安静的时间和空间，答案会在内省中浮现。'},
    
    {id:10,name:'命运之轮',nameEn:'Wheel of Fortune',arcana:'major',suit:null,number:10,element:'火',planet:'木星',
     symbol:'🎡',
     uprightKeywords:['命运转折','机遇降临','因果循环','顺势而为'],
     reversedKeywords:['厄运低谷','抵抗变化','错失良机','失控感'],
     uprightMeaning:'命运之轮不断旋转，提醒我们生命中没有永恒的顺境或逆境。正位预示着积极的变化和新的机遇即将到来。顺应变化，把握时机。',
     reversedMeaning:'逆位的命运之轮可能暗示你正在经历低谷期，或者你在抵抗不可避免的变化。接受变化是成长的一部分。',
     imageDesc:'一个巨大的轮子悬浮在云端，上面刻有神秘符号。轮子周围有四个带翼的生物——人、鹰、狮、牛。一只蛇沿着轮子向下爬，一只豺狼头生物向上攀升。',
     archetype:'变革者',advice:'接受变化是生命的常态，在变化中寻找机遇。'},
    
    {id:11,name:'正义',nameEn:'Justice',arcana:'major',suit:null,number:11,element:'风',planet:'天秤座',
     symbol:'⚖️',
     uprightKeywords:['公正','因果报应','真相','理性判断','平衡'],
     reversedKeywords:['不公正','逃避责任','偏见','失衡'],
     uprightMeaning:'正义女神手持天平和利剑，象征着公正的裁决和因果的法则。正位提醒你为自己的行为负责，做出公正的判断。',
     reversedMeaning:'逆位的正义可能暗示不公正的情况，或者你在逃避自己行为的后果。需要重新审视是否对自己和他人足够公正。',
     imageDesc:'一位庄严的女性坐在宝座上，右手持剑高举，左手持天平。她身穿红袍，头戴金冠。两根柱子在她两侧。',
     archetype:'裁决者',advice:'诚实面对真相，为自己的选择负责。'},
    
    {id:12,name:'倒吊人',nameEn:'The Hanged Man',arcana:'major',suit:null,number:12,element:'水',planet:'海王星',
     symbol:'🔮',
     uprightKeywords:['牺牲','新视角','暂停等待','放下执念','觉悟'],
     reversedKeywords:['无谓牺牲','拖延犹豫','拒绝放手','自怜'],
     uprightMeaning:'倒吊人自愿悬挂在树上，脸上却带着平静的微笑。他用全新的视角看待世界，获得了深刻的觉悟。正位鼓励你暂时放下，从不同角度看问题。',
     reversedMeaning:'逆位的倒吊人可能暗示你正在做无谓的牺牲，或者你在拖延必要的改变。也可能表示你拒绝放手已经不再适合你的事物。',
     imageDesc:'一个人头朝下悬挂在T形木架上，一条腿弯曲绑在树上。他双手背在身后，脸上带着平静的微笑，头顶有光晕。',
     archetype:'牺牲者',advice:'暂时停下来，换个角度看世界，你会有新的发现。'},
    
    {id:13,name:'死神',nameEn:'Death',arcana:'major',suit:null,number:13,element:'水',planet:'天蝎座',
     symbol:'💀',
     uprightKeywords:['结束转化','破旧立新','重生蜕变','放下过去'],
     reversedKeywords:['抗拒改变','停滞不前','恐惧结束','无法放手'],
     uprightMeaning:'死神并不意味着物理死亡，而是象征着旧有模式的终结和新生的开始。正位的死神告诉你，某些事情必须结束，才能为新的可能性腾出空间。',
     reversedMeaning:'逆位的死神暗示你可能在抗拒必要的改变，害怕结束某些关系或阶段。放手是成长的必经之路。',
     imageDesc:'一位身穿黑甲的骑士骑着白马前行，手中举着绣有白玫瑰的黑旗。地上有倒下的国王，主教在祈祷，两个孩子在一旁观望。远方有两座塔楼之间的日出。',
     archetype:'变革者',advice:'接受结束是新开始的前奏，勇敢地放下过去。'},
    
    {id:14,name:'节制',nameEn:'Temperance',arcana:'major',suit:null,number:14,element:'火',planet:'射手座',
     symbol:'🏺',
     uprightKeywords:['平衡','调和','耐心','中庸之道','融合'],
     reversedKeywords:['失衡','极端','缺乏耐心','过度放纵'],
     uprightMeaning:'节制天使在水与火之间找到平衡，象征着对立元素的和谐融合。正位鼓励你寻找生活中的平衡点，耐心地调和不同的力量。',
     reversedMeaning:'逆位的节制暗示生活中可能出现了失衡，或者你走向了某个极端。需要重新寻找中庸之道。',
     imageDesc:'一位天使一脚踏在水中，一脚踏在岸上，正在两个杯子之间倒水。天使胸前有三角形符号。远处有一条通往山间小径的路，尽头有光芒。',
     archetype:'调和者',advice:'在生活的各个方面寻找平衡，耐心调和对立的力量。'},
    
    {id:15,name:'恶魔',nameEn:'The Devil',arcana:'major',suit:null,number:15,element:'土',planet:'摩羯座',
     symbol:'😈',
     uprightKeywords:['欲望束缚','物质执念','阴影面','诱惑考验'],
     reversedKeywords:['挣脱束缚','面对阴影','重获自由','觉醒'],
     uprightMeaning:'恶魔牌揭示了我们被欲望和恐惧所束缚的状态。但重要的是，链子是松的——我们随时可以选择挣脱。正位提醒你审视哪些执念在控制你。',
     reversedMeaning:'逆位的恶魔是积极的信号，表示你正在挣脱束缚，面对自己的阴影面，重获自由。',
     imageDesc:'一个蝙蝠翅膀的恶魔站在石柱顶端，一男一女被松松的链子拴在石柱上。恶魔右手举起诅咒的手势，左手握着燃烧的火炬。倒置的五芒星在他额头。',
     archetype:'诱惑者',advice:'审视哪些欲望和恐惧在控制你，记住你有挣脱的力量。'},
    
    {id:16,name:'塔',nameEn:'The Tower',arcana:'major',suit:null,number:16,element:'火',planet:'火星',
     symbol:'🗼',
     uprightKeywords:['突变崩塌','颠覆觉醒','破除幻象','浴火重生'],
     reversedKeywords:['逃避变革','灾难延缓','恐惧改变','内在动荡'],
     uprightMeaning:'闪电击中高塔，虚假的结构轰然倒塌。虽然看起来可怕，但这是必要的清理。正位的塔告诉你，建立在错误基础上的东西必须倒塌，才能重建真实。',
     reversedMeaning:'逆位的塔暗示你可能在逃避必要的变革，或者内在的动荡正在酝酿。主动面对比被动承受要好。',
     imageDesc:'一座高塔被闪电击中，塔顶的王冠被击落。两个人从塔上坠落。背景是黑暗的天空和火焰。塔的窗户呈恶魔之眼形状。',
     archetype:'破坏者',advice:'接受旧有结构的崩塌，这是重建更坚固基础的机会。'},
    
    {id:17,name:'星星',nameEn:'The Star',arcana:'major',suit:null,number:17,element:'风',planet:'水瓶座',
     symbol:'⭐',
     uprightKeywords:['希望','灵感','宁静治愈','信心重燃','指引方向'],
     reversedKeywords:['失去希望','脱离现实','信心动摇','自我怀疑'],
     uprightMeaning:'在经历塔的破坏之后，星星带来了希望和治愈。一位女性赤裸地跪在水边，毫无保留地将水倒回大地和池塘。正位的星星象征着纯净的希望和灵感的回归。',
     reversedMeaning:'逆位的星星暗示你可能暂时失去了希望，或者信心受到了动摇。记住星星永远在黑暗中闪耀。',
     imageDesc:'一位裸体女性跪在池塘边，一手将水倒入池塘，一手将水倒在大地上。身后有一棵大树，上面栖息着一只朱鹮。天空中一颗大星闪耀，周围环绕着七颗小星。',
     archetype:'治愈者',advice:'保持希望，相信美好的事物即将到来。'},
    
    {id:18,name:'月亮',nameEn:'The Moon',arcana:'major',suit:null,number:18,element:'水',planet:'双鱼座',
     symbol:'🌕',
     uprightKeywords:['潜意识','直觉','幻象迷雾','内在恐惧','梦境'],
     reversedKeywords:['走出迷雾','真相浮现','克服恐惧','清醒'],
     uprightMeaning:'月亮照耀着通往未知的道路，但它的光芒是朦胧的，容易产生幻觉。正位的月亮提醒你，在做出重要决定前要分清现实和幻觉。信任你的直觉，但也要保持清醒。',
     reversedMeaning:'逆位的月亮暗示迷雾正在散去，真相开始浮现。你正在克服内心的恐惧和焦虑。',
     imageDesc:'一轮满月照耀着夜空，月光洒在一条蜿蜒的小路上。一只龙虾从水中爬出，一只狗和一只狼在路边嚎叫。两座塔楼矗立在远方。',
     archetype:'梦想家',advice:'信任你的直觉，但要小心分辨现实与幻觉。'},
    
    {id:19,name:'太阳',nameEn:'The Sun',arcana:'major',suit:null,number:19,element:'火',planet:'太阳',
     symbol:'☀️',
     uprightKeywords:['成功','喜悦','活力','积极乐观','成就认可'],
     reversedKeywords:['短暂低落','过度乐观','自我中心','延迟的成功'],
     uprightMeaning:'太阳是整副牌中最积极的牌之一，象征着纯粹的快乐、成功和生命力。正位的太阳告诉你，这是充满阳光和喜悦的时期，享受每一刻。',
     reversedMeaning:'逆位的太阳只是暂时被云遮挡，整体能量仍然是积极的。可能表示快乐的延迟或需要调整乐观的程度。',
     imageDesc:'一个赤裸的孩子骑在白马上，向天空举起红旗。巨大的太阳在上方照耀着。孩子身后是向日葵花园和石墙。',
     archetype:'天真者',advice:'拥抱快乐，分享你的光芒，好事正在发生。'},
    
    {id:20,name:'审判',nameEn:'Judgement',arcana:'major',suit:null,number:20,element:'火',planet:'冥王星',
     symbol:'📯',
     uprightKeywords:['觉醒','重生','自我审视','使命呼唤','召唤'],
     reversedKeywords:['自我怀疑','拒绝反思','逃避召唤','无法原谅'],
     uprightMeaning:'天使吹响号角，灵魂从坟墓中升起接受审判。正位的审判代表着深刻的觉醒和重生，是回应内心召唤的时刻。审视你的过去，接受你的使命。',
     reversedMeaning:'逆位的审判暗示你可能在抗拒内心的召唤，或者无法原谅自己和他人。需要更深层次的自我审视。',
     imageDesc:'天使在云端吹响金色号角，旗帜上有十字标志。下方的人们从棺材中站起，张开双臂迎接召唤。远处是山脉。',
     archetype:'觉醒者',advice:'倾听内心的召唤，审视你的过去，准备迎接新的使命。'},
    
    {id:21,name:'世界',nameEn:'The World',arcana:'major',suit:null,number:21,element:'土',planet:'土星',
     symbol:'🌍',
     uprightKeywords:['圆满完成','整合成就','周期终结','新起点'],
     reversedKeywords:['未完成','缺乏闭合','半途而废','延迟'],
     uprightMeaning:'世界牌象征着一个重要周期的圆满完成。舞者在月桂花环中自由舞动，象征着整合了所有元素后的自由和成就。正位的世界告诉你，你已经到达了一个重要的里程碑。',
     reversedMeaning:'逆位的世界暗示有些事情还没有完全结束，或者你离完成只差最后一步。坚持到底，完成这个周期。',
     imageDesc:'一位裸体舞者在巨大的月桂花环中自由舞动，手持两根魔杖。花环的四个角有人、鹰、狮、牛的头像。舞者看起来既男性又女性，象征着完美的平衡。',
     archetype:'完成者',advice:'庆祝你的成就，同时准备好迎接新的旅程。'},
    
    // ===== 小阿卡纳 - 权杖组 (火元素/事业/激情) =====
    {id:22,name:'权杖王牌',nameEn:'Ace of Wands',arcana:'minor',suit:'wands',number:1,element:'火',
     uprightKeywords:['新创意','灵感迸发','新事业','潜力无限'],reversedKeywords:['创意受阻','缺乏热情','延迟'],
     uprightMeaning:'权杖王牌象征着创造力和新事业的萌芽。一股强大的能量正在涌入你的生活，带来新的机遇和灵感。',
     reversedMeaning:'逆位暗示创意可能暂时受阻，或者你对新事物缺乏热情。需要重新点燃内心的火焰。',imageDesc:'一只手从云中伸出，握着一根发芽的权杖。',advice:'抓住灵感，开始新的创造。'},
    
    {id:23,name:'权杖二',nameEn:'Two of Wands',arcana:'minor',suit:'wands',number:2,element:'火',
     uprightKeywords:['规划未来','决策','远见','掌控'],reversedKeywords:['缺乏规划','恐惧未知','犹豫'],
     uprightMeaning:'权杖二描绘一个人手持地球仪，眺望远方。这象征着你正在规划未来，做出重要的决策。',
     reversedMeaning:'逆位暗示你可能在恐惧未知，缺乏清晰的规划。',imageDesc:'一位贵族站在城堡上，手持地球仪，眺望大海。',advice:'制定长远计划，勇敢地探索新的可能性。'},
    
    {id:24,name:'权杖三',nameEn:'Three of Wands',arcana:'minor',suit:'wands',number:3,element:'火',
     uprightKeywords:['拓展视野','机遇到来','远见卓识'],reversedKeywords:['延迟','挫折','缺乏远见'],
     uprightMeaning:'权杖三表示你已经为未来做好了准备，现在正等待机遇的到来。你的远见和努力即将得到回报。',
     reversedMeaning:'逆位暗示计划可能遇到延迟或挫折。',imageDesc:'一个人站在悬崖边，看着远方的船只。',advice:'保持耐心，你播下的种子正在发芽。'},
    
    {id:25,name:'权杖四',nameEn:'Four of Wands',arcana:'minor',suit:'wands',number:4,element:'火',
     uprightKeywords:['庆祝','和谐','稳定基础','家庭'],reversedKeywords:['不稳定','缺乏和谐','过渡期'],
     uprightMeaning:'权杖四象征着庆祝、和谐与稳定。你已经建立了坚实的基础，现在是享受成果的时候。',
     reversedMeaning:'逆位暗示家庭或工作环境可能缺乏和谐。',imageDesc:'四根权杖搭成拱门，人们在庆祝。',advice:'庆祝你的成就，与所爱的人分享喜悦。'},
    
    {id:26,name:'权杖五',nameEn:'Five of Wands',arcana:'minor',suit:'wands',number:5,element:'火',
     uprightKeywords:['竞争','冲突','挑战','多样性'],reversedKeywords:['避免冲突','内在矛盾','妥协'],
     uprightMeaning:'权杖五描绘了五个人挥舞权杖的场景，象征着竞争和挑战。这些冲突可以带来成长。',
     reversedMeaning:'逆位暗示你可能在避免必要的冲突。',imageDesc:'五个人各自挥舞权杖，看似混乱的竞争。',advice:'将竞争视为成长的机会。'},
    
    {id:27,name:'权杖六',nameEn:'Six of Wands',arcana:'minor',suit:'wands',number:6,element:'火',
     uprightKeywords:['胜利','认可','自信','成就'],reversedKeywords:['失败','缺乏认可','自大'],
     uprightMeaning:'权杖六象征着胜利和公众的认可。你的努力得到了回报，现在是享受荣耀的时刻。',
     reversedMeaning:'逆位暗示可能遭遇失败或缺乏应有的认可。',imageDesc:'一位胜利者骑马归来，人群欢呼。',advice:'享受胜利，但保持谦逊。'},
    
    {id:28,name:'权杖七',nameEn:'Seven of Wands',arcana:'minor',suit:'wands',number:7,element:'火',
     uprightKeywords:['防御','坚持','挑战','勇气'],reversedKeywords:['放弃','压力过大','退缩'],
     uprightMeaning:'权杖七描绘一个人站在高处，抵御来自下方的攻击。这象征着你需要捍卫自己的立场。',
     reversedMeaning:'逆位暗示你可能感到压力过大，想要放弃。',imageDesc:'一个人站在山顶，用权杖抵御六根权杖的攻击。',advice:'坚持你的立场，不要退缩。'},
    
    {id:29,name:'权杖八',nameEn:'Eight of Wands',arcana:'minor',suit:'wands',number:8,element:'火',
     uprightKeywords:['快速行动','进展迅速','消息到来','自由'],reversedKeywords:['延迟','阻碍','等待'],
     uprightMeaning:'权杖八象征着快速的进展和行动。八根权杖飞速穿过天空，表示事情正在迅速发展。',
     reversedMeaning:'逆位暗示进展可能受到延迟或阻碍。',imageDesc:'八根权杖在天空中飞速飞行。',advice:'抓住时机，快速行动。'},
    
    {id:30,name:'权杖九',nameEn:'Nine of Wands',arcana:'minor',suit:'wands',number:9,element:'火',
     uprightKeywords:['坚韧','毅力','最后防线','警惕'],reversedKeywords:['疲惫','固执','过度防御'],
     uprightMeaning:'权杖九表示你已经经历了许多挑战，但仍保持着警惕和坚韧。你接近终点了。',
     reversedMeaning:'逆位暗示你可能过于疲惫或固执。',imageDesc:'一个人头部缠着绷带，倚靠着权杖，身后有八根权杖。',advice:'保持坚韧，胜利就在眼前。'},
    
    {id:31,name:'权杖十',nameEn:'Ten of Wands',arcana:'minor',suit:'wands',number:10,element:'火',
     uprightKeywords:['负担','责任','过度劳累','完成'],reversedKeywords:['释放负担','委派','减轻压力'],
     uprightMeaning:'权杖十象征着沉重的负担和责任。你可能承担了太多，需要学会适当放下。',
     reversedMeaning:'逆位暗示你正在学习释放不必要的负担。',imageDesc:'一个人艰难地抱着十根权杖前行。',advice:'学会委派和释放不必要的负担。'},
    
    {id:32,name:'权杖侍从',nameEn:'Page of Wands',arcana:'minor',suit:'wands',number:11,element:'火',
     uprightKeywords:['探索','热情','新消息','好奇心'],reversedKeywords:['缺乏方向','不成熟','延迟消息'],
     uprightMeaning:'权杖侍从代表着对新事物的热情和好奇心。他手持权杖，准备探索未知的领域。',
     reversedMeaning:'逆位暗示缺乏方向感或不成熟。',imageDesc:'一个年轻人好奇地看着手中的发芽权杖。',advice:'保持好奇心，勇敢探索新领域。'},
    
    {id:33,name:'权杖骑士',nameEn:'Knight of Wands',arcana:'minor',suit:'wands',number:12,element:'火',
     uprightKeywords:['冒险','行动力','热情','冲动'],reversedKeywords:['鲁莽','延迟','挫败感'],
     uprightMeaning:'权杖骑士象征着充满激情的行动和冒险精神。他勇往直前，不惧挑战。',
     reversedMeaning:'逆位暗示行动可能过于鲁莽或遇到阻碍。',imageDesc:'一位骑士骑着白马，手持权杖冲锋。',advice:'用你的热情推动行动，但要注意方向。'},
    
    {id:34,name:'权杖王后',nameEn:'Queen of Wands',arcana:'minor',suit:'wands',number:13,element:'火',
     uprightKeywords:['自信','热情','独立','魅力'],reversedKeywords:['嫉妒','自私','缺乏安全感'],
     uprightMeaning:'权杖王后是自信和魅力的化身。她热情洋溢，独立自主，能够激励身边的人。',
     reversedMeaning:'逆位暗示可能出现嫉妒或缺乏安全感。',imageDesc:'一位王后坐在向日葵装饰的宝座上，手持权杖，黑猫在她脚边。',advice:'展现你的自信和魅力，激励他人。'},
    
    {id:35,name:'权杖国王',nameEn:'King of Wands',arcana:'minor',suit:'wands',number:14,element:'火',
     uprightKeywords:['领导力','远见','魅力','企业家精神'],reversedKeywords:['专制','冲动','缺乏耐心'],
     uprightMeaning:'权杖国王是天生的领导者，拥有远见和魅力。他能够将愿景变为现实。',
     reversedMeaning:'逆位暗示领导力可能变得专制或冲动。',imageDesc:'一位国王坐在狮子装饰的宝座上，手持权杖和圆球。',advice:'用你的远见和领导力引领他人。'},
    
    // ===== 小阿卡纳 - 圣杯组 (水元素/感情/直觉) =====
    {id:36,name:'圣杯王牌',nameEn:'Ace of Cups',arcana:'minor',suit:'cups',number:1,element:'水',
     uprightKeywords:['新感情','情感萌芽','爱的开始','直觉'],reversedKeywords:['情感封闭','空虚','错失爱情'],
     uprightMeaning:'圣杯王牌象征着情感的新开始，可能是新恋情、友谊或创造力的萌芽。',
     reversedMeaning:'逆位暗示情感上的封闭或错失爱情机会。',imageDesc:'一只手从云中伸出，捧着溢出水流的圣杯。',advice:'打开心扉，接纳新的情感。'},
    
    {id:37,name:'圣杯二',nameEn:'Two of Cups',arcana:'minor',suit:'cups',number:2,element:'水',
     uprightKeywords:['爱情','伙伴关系','和谐连接','吸引力'],reversedKeywords:['分离','不和谐','误解'],
     uprightMeaning:'圣杯二象征着两个人之间深厚的连接，通常是浪漫关系或重要的伙伴关系。',
     reversedMeaning:'逆位暗示关系中可能出现不和谐或误解。',imageDesc:'一男一女互相交换圣杯，上方有带翼狮子头。',advice:'珍惜你与他人的连接，保持真诚沟通。'},
    
    {id:38,name:'圣杯三',nameEn:'Three of Cups',arcana:'minor',suit:'cups',number:3,element:'水',
     uprightKeywords:['庆祝','友谊','社交','欢乐'],reversedKeywords:['过度放纵','孤立','社交疲惫'],
     uprightMeaning:'圣杯三象征着友谊、庆祝和社交的欢乐。三个女性举杯庆祝，分享喜悦。',
     reversedMeaning:'逆位暗示可能过度放纵或感到孤立。',imageDesc:'三位女性举杯庆祝，周围是鲜花和果实。',advice:'与朋友分享快乐，庆祝生活中的美好时刻。'},
    
    {id:39,name:'圣杯四',nameEn:'Four of Cups',arcana:'minor',suit:'cups',number:4,element:'水',
     uprightKeywords:['冥想','不满','重新评估','内省'],reversedKeywords:['新机会','觉醒','接受'],
     uprightMeaning:'圣杯四描绘一个人坐在树下沉思，对递来的圣杯视而不见。这象征着对现状的不满和重新评估。',
     reversedMeaning:'逆位暗示你开始看到新的机会并愿意接受。',imageDesc:'一个人坐在树下冥想，一只手从云中递来圣杯。',advice:'审视你的内心，但也要注意身边的机会。'},
    
    {id:40,name:'圣杯五',nameEn:'Five of Cups',arcana:'minor',suit:'cups',number:5,element:'水',
     uprightKeywords:['失落','悲伤','悔恨','失望'],reversedKeywords:['接受过去','前进','释怀'],
     uprightMeaning:'圣杯五象征着失落和悲伤。一个人低头看着三个倾倒的圣杯，忽略了身后还站立的两个。',
     reversedMeaning:'逆位暗示你正在接受过去，准备向前看。',imageDesc:'一个黑袍人低头看着三个倾倒的圣杯，身后还有两个站立的。',advice:'允许自己悲伤，但不要忽略仍然拥有的美好。'},
    
    {id:41,name:'圣杯六',nameEn:'Six of Cups',arcana:'minor',suit:'cups',number:6,element:'水',
     uprightKeywords:['怀旧','回忆','纯真','童年'],reversedKeywords:['沉溺过去','不切实际','成长'],
     uprightMeaning:'圣杯六象征着美好的回忆和怀旧之情。它提醒我们珍惜过去的美好时光。',
     reversedMeaning:'逆位暗示可能过于沉溺于过去。',imageDesc:'一个孩子将装满花的圣杯递给另一个孩子。',advice:'从美好的回忆中汲取力量，但要活在当下。'},
    
    {id:42,name:'圣杯七',nameEn:'Seven of Cups',arcana:'minor',suit:'cups',number:7,element:'水',
     uprightKeywords:['幻想','选择','幻想','白日梦'],reversedKeywords:['清醒','做出决定','专注'],
     uprightMeaning:'圣杯七象征着众多的幻想和选择。云朵中浮现七个装满不同物品的圣杯，提醒你要分清现实和幻想。',
     reversedMeaning:'逆位暗示你开始清醒，做出实际的决定。',imageDesc:'一个人站在七个漂浮的圣杯前，每个装着不同的东西。',advice:'在众多选择中找到真正重要的。'},
    
    {id:43,name:'圣杯八',nameEn:'Eight of Cups',arcana:'minor',suit:'cups',number:8,element:'水',
     uprightKeywords:['离开','放弃','寻找意义','精神之旅'],reversedKeywords:['徘徊','恐惧改变','留恋'],
     uprightMeaning:'圣杯八描绘一个人离开排列整齐的圣杯，走向未知。这象征着放弃已经不 serve 你的事物，去寻找更深层的意义。',
     reversedMeaning:'逆位暗示你可能在犹豫是否离开。',imageDesc:'一个人背对八个圣杯，在月光下走向山路。',advice:'有时候离开是勇敢的选择。'},
    
    {id:44,name:'圣杯九',nameEn:'Nine of Cups',arcana:'minor',suit:'cups',number:9,element:'水',
     uprightKeywords:['满足','愿望实现','情感丰盛','幸福'],reversedKeywords:['贪婪','不满','空虚'],
     uprightMeaning:'圣杯九被称为"许愿牌"，象征着愿望的实现和情感上的满足。',
     reversedMeaning:'逆位暗示即使拥有许多仍感到不满。',imageDesc:'一个人满足地坐在九个圣杯前。',advice:'感恩你所拥有的，享受当下的满足。'},
    
    {id:45,name:'圣杯十',nameEn:'Ten of Cups',arcana:'minor',suit:'cups',number:10,element:'水',
     uprightKeywords:['幸福美满','家庭和谐','情感圆满','爱'],reversedKeywords:['家庭矛盾','不和谐','理想破灭'],
     uprightMeaning:'圣杯十象征着情感生活的圆满，包括幸福的家庭和和谐的关系。',
     reversedMeaning:'逆位暗示家庭或关系中可能出现矛盾。',imageDesc:'一对夫妇和两个孩子在彩虹下的十只圣杯前跳舞。',advice:'珍惜你的家人和亲密关系。'},
    
    {id:46,name:'圣杯侍从',nameEn:'Page of Cups',arcana:'minor',suit:'cups',number:11,element:'水',
     uprightKeywords:['创意消息','好奇心','直觉','想象力'],reversedKeywords:['情感不成熟','创意受阻','不切实际'],
     uprightMeaning:'圣杯侍从代表着创意的灵感和直觉的觉醒。他从圣杯中看到跳出的鱼，象征着意想不到的灵感。',
     reversedMeaning:'逆位暗示情感上可能不够成熟。',imageDesc:'一个年轻人惊讶地看着从圣杯中跳出的鱼。',advice:'保持开放的心态，接受灵感的馈赠。'},
    
    {id:47,name:'圣杯骑士',nameEn:'Knight of Cups',arcana:'minor',suit:'cups',number:12,element:'水',
     uprightKeywords:['浪漫','魅力','创意','理想主义'],reversedKeywords:['不切实际','情感操控','嫉妒'],
     uprightMeaning:'圣杯骑士是最浪漫的牌之一，象征着魅力、创意和理想主义的爱情。',
     reversedMeaning:'逆位暗示可能过于不切实际或情感操控。',imageDesc:'一位骑士骑着白马，手持圣杯。',advice:'追随你的心，但保持理性。'},
    
    {id:48,name:'圣杯王后',nameEn:'Queen of Cups',arcana:'minor',suit:'cups',number:13,element:'水',
     uprightKeywords:['同理心','直觉','情感智慧','温柔'],reversedKeywords:['情绪化','依赖','不安全感'],
     uprightMeaning:'圣杯王后是情感智慧的化身，她拥有深刻的同理心和直觉力。',
     reversedMeaning:'逆位暗示可能过于情绪化或依赖他人。',imageDesc:'一位王后坐在海边的宝座上，手持封闭的圣杯。',advice:'信任你的直觉，用同理心去理解他人。'},
    
    {id:49,name:'圣杯国王',nameEn:'King of Cups',arcana:'minor',suit:'cups',number:14,element:'水',
     uprightKeywords:['情感平衡','智慧','外交','冷静'],reversedKeywords:['情绪压抑','操控','冷酷'],
     uprightMeaning:'圣杯国王象征着情感上的成熟和平衡。他能够在理性和感性之间找到完美的平衡。',
     reversedMeaning:'逆位暗示情感可能被压抑或用于操控。',imageDesc:'一位国王坐在海中的宝座上，一手持杯，一手持权杖。',advice:'保持情感的平衡，用智慧引导你的决定。'},
    
    // ===== 小阿卡纳 - 宝剑组 (风元素/思维/冲突) =====
    {id:50,name:'宝剑王牌',nameEn:'Ace of Swords',arcana:'minor',suit:'swords',number:1,element:'风',
     uprightKeywords:['清晰思维','真理','突破','正义'],reversedKeywords:['混乱','误解','滥用权力'],
     uprightMeaning:'宝剑王牌象征着清晰的思维和真理的力量。它代表着突破性的洞察和新的理解。',
     reversedMeaning:'逆位暗示思维可能混乱或被误解。',imageDesc:'一只手从云中伸出，高举宝剑，剑尖有皇冠和橄榄枝。',advice:'用清晰的思维寻找真理。'},
    
    {id:51,name:'宝剑二',nameEn:'Two of Swords',arcana:'minor',suit:'swords',number:2,element:'风',
     uprightKeywords:['僵局','艰难选择','回避','平衡'],reversedKeywords:['信息过载','做出决定','释放'],
     uprightMeaning:'宝剑二描绘一个蒙眼女性，手持双剑交叉在胸前。这象征着艰难的选择和内心的僵局。',
     reversedMeaning:'逆位暗示你需要做出决定，不能再回避。',imageDesc:'一位蒙眼女性坐在海边，手持双剑交叉在胸前。',advice:'面对你的选择，不要再逃避。'},
    
    {id:52,name:'宝剑三',nameEn:'Three of Swords',arcana:'minor',suit:'swords',number:3,element:'风',
     uprightKeywords:['心碎','悲伤','分离','背叛'],reversedKeywords:['释放痛苦','原谅','康复'],
     uprightMeaning:'宝剑三是一张强烈的牌，象征着心碎、悲伤和分离。三把剑刺穿一颗心。',
     reversedMeaning:'逆位暗示你正在释放痛苦，走向康复。',imageDesc:'一颗心被三把剑刺穿，背景是暴风雨。',advice:'允许自己感受悲伤，这是疗愈的一部分。'},
    
    {id:53,name:'宝剑四',nameEn:'Four of Swords',arcana:'minor',suit:'swords',number:4,element:'风',
     uprightKeywords:['休息','恢复','冥想','准备'],reversedKeywords:['疲惫','不安','恢复行动'],
     uprightMeaning:'宝剑四象征着必要的休息和恢复。你需要暂时停下来，为下一阶段积蓄力量。',
     reversedMeaning:'逆位暗示你可能准备重新开始行动。',imageDesc:'一位骑士躺在石棺上，三把剑挂在墙上，一把在下方。',advice:'给自己时间休息和恢复。'},
    
    {id:54,name:'宝剑五',nameEn:'Five of Swords',arcana:'minor',suit:'swords',number:5,element:'风',
     uprightKeywords:['冲突','失败','赢了战斗输了战争'],reversedKeywords:['和解','放下','原谅'],
     uprightMeaning:'宝剑五象征着冲突和不光彩的胜利。有时候赢得争论反而失去了更重要的东西。',
     reversedMeaning:'逆位暗示走向和解和原谅。',imageDesc:'一个人得意地拿着三把剑，另外两个人沮丧地离开。',advice:'选择你的战斗，有些胜利不值得争取。'},
    
    {id:55,name:'宝剑六',nameEn:'Six of Swords',arcana:'minor',suit:'swords',number:6,element:'风',
     uprightKeywords:['过渡','离开','疗愈之旅','前进'],reversedKeywords:['停滞','无法离开','困境'],
     uprightMeaning:'宝剑六象征着从困难中离开，走向更平静的水域。这是一个疗愈和过渡的时期。',
     reversedMeaning:'逆位暗示你可能难以离开困境。',imageDesc:'一个人划船渡河，船上插着六把剑，带着一个孩子。',advice:'相信旅程会带你到更好的地方。'},
    
    {id:56,name:'宝剑七',nameEn:'Seven of Swords',arcana:'minor',suit:'swords',number:7,element:'风',
     uprightKeywords:['策略','欺骗','独自行动','逃避'],reversedKeywords:['坦白','面对后果','改变策略'],
     uprightMeaning:'宝剑七象征着策略和欺骗。一个人偷偷拿走五把剑，留下两把。可能需要更聪明的方法。',
     reversedMeaning:'逆位暗示真相可能浮出水面。',imageDesc:'一个人偷偷拿着五把剑离开军营。',advice:'审视你的策略，诚实是最好的策略。'},
    
    {id:57,name:'宝剑八',nameEn:'Eight of Swords',arcana:'minor',suit:'swords',number:8,element:'风',
     uprightKeywords:['束缚','限制','自我设限','困惑'],reversedKeywords:['解放','新视角','自由'],
     uprightMeaning:'宝剑八描绘一个被绑住眼睛的女性，被八把剑包围。但束缚她的绳子是松的——限制可能是自我设限。',
     reversedMeaning:'逆位暗示你正在挣脱自我设限。',imageDesc:'一位蒙眼被绑的女性站在浅水中，周围是八把剑。',advice:'审视哪些限制是真实的，哪些是想象的。'},
    
    {id:58,name:'宝剑九',nameEn:'Nine of Swords',arcana:'minor',suit:'swords',number:9,element:'风',
     uprightKeywords:['焦虑','噩梦','担忧','失眠'],reversedKeywords:['最坏情况已过','希望','康复'],
     uprightMeaning:'宝剑九象征着深深的焦虑和担忧。一个人坐在床上，双手捂脸，九把剑挂在墙上。',
     reversedMeaning:'逆位暗示最坏的情况已经过去。',imageDesc:'一个人坐在床上，双手捂脸，九把剑横挂在墙上。',advice:'你的恐惧大多不会成真，寻求帮助。'},
    
    {id:59,name:'宝剑十',nameEn:'Ten of Swords',arcana:'minor',suit:'swords',number:10,element:'风',
     uprightKeywords:['结束','背叛','痛苦终结','重新开始'],reversedKeywords:['恢复','无法放手','拖延结束'],
     uprightMeaning:'宝剑十象征着痛苦的结束。虽然看起来可怕，但黎明就在地平线上。这是最糟糕的时刻，也是新开始的前奏。',
     reversedMeaning:'逆位暗示你正在从最低点恢复。',imageDesc:'一个人面朝下倒在地上，十把剑插在背上。地平线上有曙光。',advice:'最黑暗的时刻之后，黎明即将到来。'},
    
    {id:60,name:'宝剑侍从',nameEn:'Page of Swords',arcana:'minor',suit:'swords',number:11,element:'风',
     uprightKeywords:['好奇心','新想法','警觉','沟通'],reversedKeywords:['闲话','缺乏计划','言辞尖锐'],
     uprightMeaning:'宝剑侍从代表着对知识的渴望和敏锐的思维。他警觉地持剑站立。',
     reversedMeaning:'逆位暗示言辞可能过于尖锐。',imageDesc:'一个年轻人站在风中，高举宝剑。',advice:'保持好奇心，但注意你的言辞。'},
    
    {id:61,name:'宝剑骑士',nameEn:'Knight of Swords',arcana:'minor',suit:'swords',number:12,element:'风',
     uprightKeywords:['果断','行动迅速','勇往直前','竞争'],reversedKeywords:['鲁莽','冲动','缺乏耐心'],
     uprightMeaning:'宝剑骑士象征着快速果断的行动。他骑马冲锋，不惧任何挑战。',
     reversedMeaning:'逆位暗示行动可能过于鲁莽。',imageDesc:'一位骑士骑马在风中冲锋，举剑向前。',advice:'果断行动，但不要忽略细节。'},
    
    {id:62,name:'宝剑王后',nameEn:'Queen of Swords',arcana:'minor',suit:'swords',number:13,element:'风',
     uprightKeywords:['独立','清晰','公正','直言不讳'],reversedKeywords:['冷酷','偏见','尖酸刻薄'],
     uprightMeaning:'宝剑王后象征着清晰的思维和独立的精神。她用公正的眼光看待一切。',
     reversedMeaning:'逆位暗示可能过于冷酷或偏见。',imageDesc:'一位王后坐在云中的宝座上，一手举起宝剑。',advice:'保持清晰的思维，但不要失去温情。'},
    
    {id:63,name:'宝剑国王',nameEn:'King of Swords',arcana:'minor',suit:'swords',number:14,element:'风',
     uprightKeywords:['权威','理性','公正','清晰判断'],reversedKeywords:['专制','滥用权力','冷酷无情'],
     uprightMeaning:'宝剑国王象征着理性和权威。他用清晰的判断力和公正的态度处理事务。',
     reversedMeaning:'逆位暗示权力可能被滥用。',imageDesc:'一位国王坐在宝座上，手持宝剑，表情严肃。',advice:'用理性和公正来引导你的决定。'},
    
    // ===== 小阿卡纳 - 星币组 (土元素/物质/实际) =====
    {id:64,name:'星币王牌',nameEn:'Ace of Pentacles',arcana:'minor',suit:'pentacles',number:1,element:'土',
     uprightKeywords:['新机会','财富','物质丰盛','新开始'],reversedKeywords:['错失机会','财务不稳','缺乏规划'],
     uprightMeaning:'星币王牌象征着物质世界的新机会，可能是新的收入来源、投资机会或事业的开始。',
     reversedMeaning:'逆位暗示可能错失财务机会。',imageDesc:'一只手从花园门中伸出，托着一枚大星币。',advice:'抓住物质世界的新机会。'},
    
    {id:65,name:'星币二',nameEn:'Two of Pentacles',arcana:'minor',suit:'pentacles',number:2,element:'土',
     uprightKeywords:['平衡','适应','灵活','多任务'],reversedKeywords:['失衡','过度承担','混乱'],
     uprightMeaning:'星币二象征着在多个事务间保持平衡。一个人灵活地玩弄两枚星币。',
     reversedMeaning:'逆位暗示你可能承担了太多。',imageDesc:'一个人在跳舞，双手各持一枚星币，形成无限符号。',advice:'保持灵活，适应变化。'},
    
    {id:66,name:'星币三',nameEn:'Three of Pentacles',arcana:'minor',suit:'pentacles',number:3,element:'土',
     uprightKeywords:['团队合作','技能','专业','建设'],reversedKeywords:['缺乏团队精神','平庸','方向不明'],
     uprightMeaning:'星币三象征着团队合作和专业技能的结合。三个人共同建造一座建筑。',
     reversedMeaning:'逆位暗示团队合作可能出现问题。',imageDesc:'三个人在教堂中合作建造，一人设计，一人砌墙。',advice:'与他人合作，发挥各自的专业技能。'},
    
    {id:67,name:'星币四',nameEn:'Four of Pentacles',arcana:'minor',suit:'pentacles',number:4,element:'土',
     uprightKeywords:['保守','安全','控制','储蓄'],reversedKeywords:['贪婪','过度执着','释放'],
     uprightMeaning:'星币四象征着对物质的保守和控制。一个人紧紧抓住四枚星币。',
     reversedMeaning:'逆位暗示可能过度执着于物质。',imageDesc:'一个人坐在长椅上，紧抱一枚星币，脚下踩着两枚，头顶一枚。',advice:'适度储蓄，但不要让金钱控制你。'},
    
    {id:68,name:'星币五',nameEn:'Five of Pentacles',arcana:'minor',suit:'pentacles',number:5,element:'土',
     uprightKeywords:['贫困','困难','失去','孤立'],reversedKeywords:['恢复','帮助到来','走出困境'],
     uprightMeaning:'星币五象征着物质上的困难和精神上的贫乏。两个人在雪中艰难前行。',
     reversedMeaning:'逆位暗示情况正在好转。',imageDesc:'两个衣衫褴褛的人在雪中走过教堂窗户。',advice:'困难时期终会过去，寻求帮助。'},
    
    {id:69,name:'星币六',nameEn:'Six of Pentacles',arcana:'minor',suit:'pentacles',number:6,element:'土',
     uprightKeywords:['慷慨','给予','公平','分享'],reversedKeywords:['自私','债务','不公平'],
     uprightMeaning:'星币六象征着慷慨和公平的分享。一个富人向穷人分发星币。',
     reversedMeaning:'逆位暗示给予可能不公平。',imageDesc:'一位富人手持天平，向两个跪着的人分发星币。',advice:'在给予和接受之间保持平衡。'},
    
    {id:70,name:'星币七',nameEn:'Seven of Pentacles',arcana:'minor',suit:'pentacles',number:7,element:'土',
     uprightKeywords:['耐心等待','投资','长期回报','评估'],reversedKeywords:['缺乏耐心','急于求成','浪费精力'],
     uprightMeaning:'星币七象征着耐心等待收获。一个人倚着锄头，看着正在生长的植物。',
     reversedMeaning:'逆位暗示你可能缺乏耐心。',imageDesc:'一个人倚着锄头，看着长出星币的植物。',advice:'耐心等待，你的努力终将得到回报。'},
    
    {id:71,name:'星币八',nameEn:'Eight of Pentacles',arcana:'minor',suit:'pentacles',number:8,element:'土',
     uprightKeywords:['勤奋','专注','技能提升','匠心'],reversedKeywords:['缺乏专注','重复工作','无聊'],
     uprightMeaning:'星币八象征着通过勤奋工作提升技能。一个人专注地雕刻星币。',
     reversedMeaning:'逆位暗示工作可能变得单调。',imageDesc:'一个人坐在长椅上，专注地雕刻一枚枚星币。',advice:'专注于提升你的技能，细节决定成败。'},
    
    {id:72,name:'星币九',nameEn:'Nine of Pentacles',arcana:'minor',suit:'pentacles',number:9,element:'土',
     uprightKeywords:['独立','自足','优雅','成就'],reversedKeywords:['过度依赖','虚荣','孤独'],
     uprightMeaning:'星币九象征着通过自己的努力获得的独立和自足。一位优雅的女性在花园中。',
     reversedMeaning:'逆位暗示可能过度依赖物质。',imageDesc:'一位优雅的女性站在丰收的花园中，手上停着猎鹰。',advice:'享受你努力的成果，保持独立。'},
    
    {id:73,name:'星币十',nameEn:'Ten of Pentacles',arcana:'minor',suit:'pentacles',number:10,element:'土',
     uprightKeywords:['财富','家族','传承','稳定'],reversedKeywords:['家族矛盾','财务不稳','遗产纠纷'],
     uprightMeaning:'星币十象征着世代相传的财富和家族的稳定。这是物质丰盛的最高点。',
     reversedMeaning:'逆位暗示家族或财务可能出现问题。',imageDesc:'一位老人坐在拱门下，周围是家人和十枚星币。',advice:'珍惜你的家庭和财富，为未来做规划。'},
    
    {id:74,name:'星币侍从',nameEn:'Page of Pentacles',arcana:'minor',suit:'pentacles',number:11,element:'土',
     uprightKeywords:['学习','新技能','机会','勤奋'],reversedKeywords:['缺乏进步','懒惰','不切实际'],
     uprightMeaning:'星币侍从代表着对知识和技能的渴望。他认真地看着手中的星币。',
     reversedMeaning:'逆位暗示学习可能缺乏进展。',imageDesc:'一个年轻人认真地看着手中的大星币。',advice:'保持学习的态度，机会就在眼前。'},
    
    {id:75,name:'星币骑士',nameEn:'Knight of Pentacles',arcana:'minor',suit:'pentacles',number:12,element:'土',
     uprightKeywords:['勤奋','可靠','耐心','责任感'],reversedKeywords:['停滞','懒惰','缺乏进展'],
     uprightMeaning:'星币骑士是最可靠的牌之一，象征着勤奋、耐心和责任感。',
     reversedMeaning:'逆位暗示进展可能停滞。',imageDesc:'一位骑士骑着黑马，慢慢前行，手持星币。',advice:'保持勤奋和耐心，稳扎稳打。'},
    
    {id:76,name:'星币王后',nameEn:'Queen of Pentacles',arcana:'minor',suit:'pentacles',number:13,element:'土',
     uprightKeywords:['丰盛','实际','母性','安全感'],reversedKeywords:['过度关注物质','忽视精神','嫉妒'],
     uprightMeaning:'星币王后象征着实际的智慧和物质的丰盛。她能够在物质和精神之间找到平衡。',
     reversedMeaning:'逆位暗示可能过度关注物质。',imageDesc:'一位王后坐在花园中，怀抱星币，周围是鲜花。',advice:'用实际的方式照顾你爱的人。'},
    
    {id:77,name:'星币国王',nameEn:'King of Pentacles',arcana:'minor',suit:'pentacles',number:14,element:'土',
     uprightKeywords:['成功','富裕','商业头脑','安全'],reversedKeywords:['贪婪','物质主义','固执'],
     uprightMeaning:'星币国王象征着物质世界的成功和稳定。他通过勤奋和智慧积累了财富。',
     reversedMeaning:'逆位暗示可能过于贪婪或固执。',imageDesc:'一位国王坐在葡萄藤装饰的宝座上，手捧大星币。',advice:'用你的成功去帮助他人，保持慷慨。'}
];

// 获取完整的78张牌组
function getFullDeck() {
    return TAROT_CARDS.map((card, index) => ({
        ...card,
        imageFile: TAROT_IMAGE_FILES[index]
    }));
}

// 获取大阿卡纳
function getMajorArcana() {
    return TAROT_CARDS.filter(c => c.arcana === 'major').map((card, i) => ({
        ...card, imageFile: TAROT_IMAGE_FILES[card.id]
    }));
}

// 获取小阿卡纳
function getMinorArcana(suit) {
    return TAROT_CARDS.filter(c => c.suit === suit).map(card => ({
        ...card, imageFile: TAROT_IMAGE_FILES[card.id]
    }));
}

class ForumController {
    // root controller, no any request - just return recent topics
    static async getMain(_ ,res, next) {
        try{
            const { MostRecentTopics, NewsLenta } = await ForumService.getMainPageData();
            return res.status(200).json({ MostRecentTopics, NewsLenta });
        } catch(err){
            next(err)
        }
    }
}

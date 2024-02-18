import topics from "../models/topics";
import { sequelize } from "../pg_connect";

export class ForumService {
    static async getMainPageData() {
        let MostRecentTopics;
        await sequelize.transaction(async () => {
            MostRecentTopics = await topics.findMany({
                limit: 5,
                order:
            });
            // transaction will rollback on error throw
        });
    }
}

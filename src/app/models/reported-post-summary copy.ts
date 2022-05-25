import { PostSummary } from './post-summary';

export class ReportedPostSummary extends PostSummary
{
    public numReports: number;
    public firstReportedAt: Date;
}
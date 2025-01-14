import { connect, ImapSimple, ImapSimpleOptions } from 'imap-simple';
import { ParsedMail, simpleParser } from 'mailparser';

interface Email {
  subject: string;
  from: string;
  date: Date;
  body: string;
}

export class ImapFetcher {
  private imapConfig: ImapSimpleOptions;
  private lastSeenUID: number | null = null;
  private imap: ImapSimple | null = null;

  constructor(imapConfig: ImapSimpleOptions) {
    this.imapConfig = imapConfig;
  }

  async connect(): Promise<void> {
    if (!this.imap) {
      this.imap = await connect(this.imapConfig);
    }
  }

  async fetchUnreadEmails(): Promise<Email[]> {
    if (!this.imap) {
      throw new Error('IMAP connection not established.');
    }

    await this.imap.openBox('INBOX'); // Open the inbox
    const searchCriteria = ['UNSEEN']; // Fetch unread emails

    const fetchOptions = {
      bodies: ['HEADER', 'TEXT'],
      struct: true,
    };

    const results = await this.imap.search(searchCriteria, fetchOptions);

    const emails: Email[] = [];
    for (const result of results) {
      const uid = result.attributes.uid;

      // Ignore emails with a UID less than or equal to the last seen UID
      if (this.lastSeenUID !== null && uid <= this.lastSeenUID) {
        continue;
      }

      const parsed = await simpleParser(result.parts[1].body);
      console.log({ parsed });
      const email: Email = {
        subject: parsed.subject || '',
        from: parsed.from?.text || '',
        date: parsed.date || new Date(),
        body: parsed.text || '',
      };

      emails.push(email);

      // Update the last seen UID
      if (this.lastSeenUID === null || uid > this.lastSeenUID) {
        this.lastSeenUID = uid;
      }
    }

    return emails;
  }

  async disconnect(): Promise<void> {
    if (this.imap) {
      await this.imap.end();
      this.imap = null;
    }
  }
}
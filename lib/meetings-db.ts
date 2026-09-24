import { neon } from '@neondatabase/serverless';
import type { SacramentMeeting } from './types';

const sql = neon(process.env.DATABASE_URL!);
const ITEMS_PER_PAGE = 5;

// Función para asegurar que la tabla 'meetings' exista e insertar datos de prueba si está vacía
async function ensureTableExists() {
  await sql`
    CREATE TABLE IF NOT EXISTS meetings (
      id             SERIAL        PRIMARY KEY,
      date           DATE          NOT NULL UNIQUE,
      meeting_type   VARCHAR(20)   NOT NULL
                                   CHECK (meeting_type IN
                                     ('testimony','regular','stake','general','special')),
      presiding      VARCHAR(255)  NOT NULL,
      conducting     VARCHAR(255)  NOT NULL,
      announcements  TEXT[]        DEFAULT '{}',
      opening_hymn   JSONB         NOT NULL,
      opening_prayer VARCHAR(255)  NOT NULL,
      ward_business  JSONB         DEFAULT '[]',
      stake_business BOOLEAN       DEFAULT false,
      sacrament_hymn JSONB         NOT NULL,
      speakers       JSONB         DEFAULT '[]',
      closing_hymn   JSONB         NOT NULL,
      closing_prayer VARCHAR(255)  NOT NULL
    );
  `;

  // Verificar si la tabla está vacía para insertar los registros de prueba requeridos
  const countResult = await sql`SELECT COUNT(*) FROM meetings;`;
  const count = Number(countResult[0].count);

  if (count === 0) {
    await sql`
      INSERT INTO meetings (
        date, meeting_type, presiding, conducting, announcements,
        opening_hymn, opening_prayer, ward_business, stake_business,
        sacrament_hymn, speakers, closing_hymn, closing_prayer
      ) VALUES
      ('2026-01-04','testimony','Bishop Thompson','Brother Nakamura',ARRAY[]::TEXT[],'{"number":134,"title":"I Believe in Christ"}','Sister Park','[]',false,'{"number":175,"title":"God, Our Father, Hear Us Pray"}','[]','{"number":219,"title":"Because I Have Been Given Much"}','Brother Alvarez'),
      ('2026-01-11','regular','Bishop Thompson','Brother Nakamura',ARRAY['Ward temple night: Jan 30'],'{"number":2,"title":"The Spirit of God"}','Sister Ramirez','[{"description":"Sustaining of new Sunday School president"}]',true,'{"number":169,"title":"In Remembrance of Thy Suffering"}','[{"name":"Sister Chen","topic":"The Sacrament","type":"speaker"},{"name":"Brother Osei","topic":"Covenant Keeping","type":"speaker"}]','{"number":31,"title":"O God, Our Help in Ages Past"}','Brother Lewis'),
      ('2026-01-18','regular','Bishop Thompson','Sister Torres',ARRAY['Ministering interviews this week'],'{"number":85,"title":"How Firm a Foundation"}','Brother Kim','[{"description":"Release - Sister Martinez - Primary Teacher"},{"description":"Sustain - Sister Agbavor - Primary Teacher"}, {"description":"Sustain - Sister Mukiwa - RS 2nd Counselor"}]',false,'{"number":173,"title":"While of These Emblems We Partake"}','[{"name":"Sister Nakamura","topic":"Personal Revelation","type":"speaker"},{"name":"Youth Choir","topic":"","type":"musical-number"},{"name":"Brother Santos","topic":"Temple Covenants","type":"speaker"}]','{"number":226,"title":"Improve the Shining Moments"}','Sister Jensen'),
      ('2026-01-25','stake','President Gimenez','',ARRAY[]::TEXT[],'{"number":100,"title":"Sample Opening"}','Opening Prayer','[]',true,'{"number":150,"title":"Sample Sacrament"}','[]','{"number":200,"title":"Sample Closing"}','Closing Prayer'),
      ('2026-02-01','regular','Bishop Thompson','Brother Nakamura',ARRAY[]::TEXT[],'{"number":1,"title":"The Morning Breaks"}','Sister Gomez','[]',false,'{"number":180,"title":"God Loved Us, So He Sent His Son"}','[{"name":"Brother Perez","topic":"Faith","type":"speaker"}]','{"number":210,"title":"Wandering Souls"}','Sister Smith'),
      ('2026-02-08','regular','Bishop Thompson','Sister Torres',ARRAY[]::TEXT[],'{"number":3,"title":"Now Let Us Rejoice"}','Brother Diaz','[]',false,'{"number":185,"title":"Reverently and Meekly Now"}','[{"name":"Sister Ruiz","topic":"Hope","type":"speaker"}]','{"number":220,"title":"Lord, Dismiss Us with Thy Blessing"}','Brother Brown'),
      ('2026-02-15','testimony','Bishop Thompson','Brother Nakamura',ARRAY[]::TEXT[],'{"number":4,"title":"Truth Eternal"}','Sister Rojas','[]',false,'{"number":190,"title":"In Memory of the Crucified"}','[]','{"number":230,"title":"We Give Thee But Thine Own"}','Sister White'),
      ('2026-02-22','regular','Bishop Thompson','Sister Torres',ARRAY[]::TEXT[],'{"number":5,"title":"High on the Mountain Top"}','Brother Castro','[]',false,'{"number":195,"title":"As Now We Take the Broken Bread"}','[{"name":"Brother Gomez","topic":"Charity","type":"speaker"}]','{"number":240,"title":"Keep the Commandments"}','Brother Green');
    `;
  }
}

export async function getMeetings(
  query: string = '',
  currentPage: number = 1
): Promise<SacramentMeeting[]> {
  await ensureTableExists();
  const searchTerm = `%${query}%`;
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  const rows = await sql`
    SELECT
      id,
      to_char(date, 'YYYY-MM-DD') AS "date",
      meeting_type                    AS "meetingType",
      presiding, conducting, announcements,
      opening_hymn                    AS "openingHymn",
      opening_prayer                  AS "openingPrayer",
      ward_business                   AS "wardBusiness",
      stake_business                  AS "stakeBusiness",
      sacrament_hymn                  AS "sacramentHymn",
      speakers,
      closing_hymn                    AS "closingHymn",
      closing_prayer                  AS "closingPrayer"
    FROM meetings
    WHERE
      presiding    ILIKE ${searchTerm}
      OR conducting ILIKE ${searchTerm}
      OR meeting_type ILIKE ${searchTerm}
      OR speakers::text ILIKE ${searchTerm}
    ORDER BY date DESC
    LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
  `;
  return rows as unknown as SacramentMeeting[];
}

export async function getMeetingsTotalPages(
  query: string = ''
): Promise<number> {
  await ensureTableExists();
  const searchTerm = `%${query}%`;
  const rows = await sql`
    SELECT COUNT(*) FROM meetings
    WHERE
      presiding    ILIKE ${searchTerm}
      OR conducting ILIKE ${searchTerm}
      OR meeting_type ILIKE ${searchTerm}
      OR speakers::text ILIKE ${searchTerm}
  `;
  return Math.ceil(Number(rows[0].count) / ITEMS_PER_PAGE);
}

export async function getMeetingById(
  id: number
): Promise<SacramentMeeting | null> {
  await ensureTableExists();
  const rows = await sql`
    SELECT
      id,
      to_char(date, 'YYYY-MM-DD') AS "date",
      meeting_type                    AS "meetingType",
      presiding, conducting, announcements,
      opening_hymn                    AS "openingHymn",
      opening_prayer                  AS "openingPrayer",
      ward_business                   AS "wardBusiness",
      stake_business                  AS "stakeBusiness",
      sacrament_hymn                  AS "sacramentHymn",
      speakers,
      closing_hymn                    AS "closingHymn",
      closing_prayer                  AS "closingPrayer"
    FROM meetings WHERE id = ${id}
  `;
  return (rows[0] as unknown as SacramentMeeting) ?? null;
}

// Mutation stubs — will be wired to the database in Week 04
export async function addMeeting(
  data: Omit<SacramentMeeting, 'id'>
): Promise<SacramentMeeting> {
  throw new Error('addMeeting: database implementation coming in Week 04');
}

export async function updateMeeting(
  id: number,
  updates: Partial<SacramentMeeting>
): Promise<SacramentMeeting | null> {
  throw new Error('updateMeeting: database implementation coming in Week 04');
}

export async function deleteMeeting(id: number): Promise<boolean> {
  throw new Error('deleteMeeting: database implementation coming in Week 04');
}
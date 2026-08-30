import { supabase } from '@/lib/supabase';

export default async function SupabaseTest() {
    const { data, error } = await supabase
        .from('pages')
        .select('id, title, slug, page_type')
        .limit(1);

    console.log('data:', data);
    console.log('error:', error);

    return (
        <main>
            <h1>Supabase Smoke Test</h1>

            <pre>
                {JSON.stringify({ data, error }, null, 2)}
            </pre>
        </main>
    );
}
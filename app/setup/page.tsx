import Link from 'next/link';
import styles from './setup.module.css';

export default function SetupPage() {
    const hasSupabase = process.env.NEXT_PUBLIC_SUPABASE_URL &&
        process.env.NEXT_PUBLIC_SUPABASE_URL !== 'your-supabase-url';

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h1 className={styles.title}>🚀 Welcome to PathLy!</h1>
                <p className={styles.subtitle}>Your AI-powered skill learning platform</p>

                {!hasSupabase ? (
                    <>
                        <div className={styles.warning}>
                            <h2>⚠️ Setup Required</h2>
                            <p>PathLy requires Supabase to be configured. Follow these steps:</p>
                        </div>

                        <div className={styles.steps}>
                            <div className={styles.step}>
                                <div className={styles.stepNumber}>1</div>
                                <div className={styles.stepContent}>
                                    <h3>Create Supabase Project</h3>
                                    <p>Visit <a href="https://supabase.com" target="_blank" rel="noopener noreferrer">supabase.com</a> and create a free account</p>
                                    <p>Create a new project (takes ~2 minutes)</p>
                                </div>
                            </div>

                            <div className={styles.step}>
                                <div className={styles.stepNumber}>2</div>
                                <div className={styles.stepContent}>
                                    <h3>Run SQL Migrations</h3>
                                    <p>In your Supabase Dashboard, go to SQL Editor</p>
                                    <p>Copy the contents of <code>supabase/migrations.sql</code> from your project</p>
                                    <p>Run the SQL to create tables and security policies</p>
                                </div>
                            </div>

                            <div className={styles.step}>
                                <div className={styles.stepNumber}>3</div>
                                <div className={styles.stepContent}>
                                    <h3>Get API Credentials</h3>
                                    <p>In Supabase: Settings → API</p>
                                    <p>Copy <strong>Project URL</strong> and <strong>anon/public key</strong></p>
                                </div>
                            </div>

                            <div className={styles.step}>
                                <div className={styles.stepNumber}>4</div>
                                <div className={styles.stepContent}>
                                    <h3>Update Environment Variables</h3>
                                    <p>Open <code>.env</code> in your project root</p>
                                    <p>Replace the placeholder values:</p>
                                    <pre className={styles.codeBlock}>
                                        {`NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key`}
                                    </pre>
                                </div>
                            </div>

                            <div className={styles.step}>
                                <div className={styles.stepNumber}>5</div>
                                <div className={styles.stepContent}>
                                    <h3>Restart Dev Server</h3>
                                    <p>Stop the dev server (Ctrl+C)</p>
                                    <p>Run <code>npm run dev</code> again</p>
                                    <p>Refresh this page!</p>
                                </div>
                            </div>
                        </div>

                        <div className={styles.footer}>
                            <p>Need help? Check <code>README.md</code> or <code>walkthrough.md</code> in your project!</p>
                        </div>
                    </>
                ) : (
                    <>
                        <div className={styles.success}>
                            <h2>✅ Supabase Connected!</h2>
                            <p>PathLy is ready to go. Start your learning journey now!</p>
                        </div>
                        <Link href="/login" className="btn btn-primary" style={{ width: '100%', marginTop: '2rem' }}>
                            Go to Login
                        </Link>
                    </>
                )}
            </div>
        </div>
    );
}

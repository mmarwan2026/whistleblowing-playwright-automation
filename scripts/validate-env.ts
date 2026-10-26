import 'dotenv/config';

const errors: string[] = [];

function required(name: string): string {
    const value = process.env[name]?.trim();

    if (!value) {
        errors.push(`${name} is required.`);
    }

    return value ?? '';
}

function requiredUrl(name: string): string {
    const value = required(name);

    if (value) {
        try {
            const url = new URL(value);
            if (!['http:', 'https:'].includes(url.protocol)) {
                errors.push(`${name} must use http or https.`);
            }
        } catch {
            errors.push(`${name} must be a valid URL.`);
        }
    }

    return value;
}

const baseUrl = requiredUrl('BASE_URL');
const staffUrl = requiredUrl('STAFF_URL');
required('LEAD_INVESTIGATOR_USERNAME');
required('LEAD_INVESTIGATOR_PASSWORD');
required('STAFF_USERNAME');
required('STAFF_PASSWORD');

if (process.env.API_URL?.trim()) {
    errors.push('API_URL must not be configured; this project is UI-only.');
}

if (errors.length > 0) {
    console.error('Environment validation failed:');
    for (const error of errors) {
        console.error(`- ${error}`);
    }
    process.exitCode = 1;
} else {
    console.log('Environment validation passed for UI tests.');
    console.log(`BASE_URL: ${baseUrl}`);
    console.log(`STAFF_URL: ${staffUrl}`);
    console.log('Case Numbers: discovered dynamically at runtime.');
}

import { exec } from 'child_process';

export const checkServerStatus = (port: number): Promise<number> => {
	return new Promise((resolve, reject) => {
		exec(
			`curl -s --retry 10 --retry-connrefused -o /dev/null -w "%{http_code}" http://localhost:${port}/api/health`,
			(error, stdout) => {
				if (error) {
					console.error('Error executing curl:', error.message);
					reject(error);
					return;
				}

				const statusCode = parseInt(stdout.trim());
				console.log(`Health check status code: ${statusCode}`);
				resolve(statusCode);
			},
		);
	});
};

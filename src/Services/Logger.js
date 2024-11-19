import colors from 'colors';

export class Logger {
	static error(...args) {
		this.log({ name: 'ERROR', options: ['bold', 'red'] }, ...args);
	}

	static warn(...args) {
		this.log({ name: 'WARN', options: ['yellow'] }, ...args);
	}

	static info(...args) {
		this.log({ name: 'INFO', options: ['cyan'] }, ...args);
	}

	static success(...args) {
		this.log({ name: 'SUCCESS', options: ['green', 'bold'] }, ...args);
	}

	static custom(tag, ...args) {
		this.log(tag, ...args);
	}

	static log(tag, ...args) {
		const date = new Date().toLocaleString('pt-BR', {
			timeZone: 'America/Sao_Paulo',
		});

		console.log(
			`[${tag.options.reduce((acc, val) => acc[val], colors.reset)(tag.name)}]`,
			`${colors.bold.grey(date)}`,
			...args,
		);
	}
}
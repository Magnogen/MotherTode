{
	window.MotherTode = (source) => {
		const result = MotherTode.parse(source)
		const translation = result.output
		let term
		try {
			const func = new Function("Term = MotherTode.Term", translation)
			term = func(MotherTode.Term)
		}
		catch(e) {
			console.error(`[MotherTode] Badly formed JavaScript:\n\n` + translation + "\n\n")
			throw e
		}
		
		console.log("")
		console.log(source)
		//console.log(lint(translation))
		
		term.success = result.success
		term.output = result.output
		term.source = result.source
		term.tail = result.tail
		term.input = result.input
		term.args = result.args
		term.error = result.error
		term.log = (...args) => {
			result.log(...args)
			return term
		}
		term.getUsefulError = result.getUsefulError
		return term
	}
	
	// TODO: make an actual linter (this one is a fake)
	const lint = (input) => {
		const state = {
			position: 0,
			indent: "",
			output: "",
		}
		while (state.position < input.length) {
			if (checkString(input, state, `[`)) {
				state.indent += "	"
				state.output += `[\n${state.indent}`
				continue
			}
			if (checkString(input, state, `]`)) {
				state.indent = state.indent.slice(0, -1)
				state.output += `\n${state.indent}]`
				continue
			}
			if (checkString(input, state, `\n`)) {
				state.output += `\n${state.indent}`
				continue
			}
			state.output += input[state.position]
			state.position++
		}
		return state.output
	}
	
	const checkString = (input, state, string) => {
		const {position} = state
		const end = position + string.length
		const snippet = input.slice(position, end)
		if (snippet === string) {
			state.position = end
			return true
		}
		return false
	}

	MotherTode.translate = (source) => {
		const result = MotherTode.parse(source)
		return result.output
	}

	MotherTode.parse = (source) => {
		const result = MotherTode.Term.term("MotherTode", MotherTode.scope)(source)
		if (!result.success) result.log(8)
		return result
	}
}
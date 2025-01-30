<template>
	<div class="chat-message">
		<div class="message-content">
			<!-- Regular text -->
			<template v-for="(part, index) in parsedContent" :key="index">
				<span v-if="part.type === 'text'">{{ part.content }}</span>

				<!-- Code blocks -->
				<div v-if="part.type === 'code'" class="code-block">
					<div class="code-header">
						<span class="language-label">{{ part.language }}</span>
						<button @click="copyCode(part.content)" class="copy-button">
							<i class="fas fa-copy"></i>
						</button>
					</div>
					<pre><code class="hljs">{{ part.content }}</code></pre>
				</div>
			</template>
		</div>
	</div>
</template>

<script>
import hljs from "highlight.js";

export default {
	props: ["content"],
	computed: {
		parsedContent() {
			const codeBlocks = [];
			let remainingContent = this.content;

			// Match code blocks with language specifier
			const regex = /```(\w+)\n([\s\S]*?)```/g;
			let match;

			while ((match = regex.exec(remainingContent)) !== null) {
				const [fullMatch, language, code] = match;
				const startIndex = match.index;
				const endIndex = startIndex + fullMatch.length;

				// Add preceding text
				if (startIndex > 0) {
					codeBlocks.push({
						type: "text",
						content: remainingContent.slice(0, startIndex),
					});
				}

				// Add code block
				codeBlocks.push({
					type: "code",
					language: language || "plaintext",
					content: code.trim(),
				});

				remainingContent = remainingContent.slice(endIndex);
			}

			// Add remaining text
			if (remainingContent.length > 0) {
				codeBlocks.push({
					type: "text",
					content: remainingContent,
				});
			}

			return codeBlocks;
		},
	},
	methods: {
		copyCode(code) {
			navigator.clipboard.writeText(code).then(() => {
				this.$toast.success("Code copied to clipboard!");
			});
		},
	},
	mounted() {
		// Highlight all code blocks
		this.$nextTick(() => {
			document.querySelectorAll("pre code").forEach((block) => {
				hljs.highlightElement(block);
			});
		});
	},
};
</script>

<style>
.code-block {
	background: #1e1e1e;
	border-radius: 4px;
	margin: 10px 0;
	position: relative;
}

.code-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 8px;
	background: #252526;
	border-radius: 4px 4px 0 0;
}

.language-label {
	color: #9cdcfe;
	font-size: 0.8em;
	text-transform: uppercase;
}

.copy-button {
	background: none;
	border: none;
	color: #d4d4d4;
	cursor: pointer;
	padding: 4px;
}

pre {
	margin: 0;
	padding: 12px;
	overflow-x: auto;
}

.hljs {
	background: #1e1e1e !important;
	color: #d4d4d4;
}
</style>

(() => {
  const source = window.DIALOGUE_DEMO;
  const transcript = document.getElementById('transcript');
  const choices = document.getElementById('choices');
  const hint = document.getElementById('hint');
  const portraits = [...document.querySelectorAll('.portrait')];
  let queue = [];
  let shown = [];
  let phase = 'opening';
  let choiceIndex = 0;

  const isTypingTarget = target => /^(INPUT|TEXTAREA|SELECT)$/.test(target?.tagName) || target?.isContentEditable;
  const isSpecial = speaker => speaker === 'You' || speaker === 'Narrator';
  const isNearBottom = () => transcript.scrollHeight - transcript.scrollTop - transcript.clientHeight < 56;

  function setSpeaker(line) {
    portraits.forEach(portrait => {
      const active = portrait.dataset.character === line.character;
      portrait.classList.toggle('is-speaking', active);
      portrait.classList.toggle('is-listening', !active && (Boolean(line.character) || line.speaker === 'Narrator' || line.speaker === 'You'));
    });
  }

  function renderHistory() {
    const followLatest = isNearBottom();
    transcript.replaceChildren(...shown.map((line, index) => {
      const item = document.createElement('article');
      item.className = `line line--${line.speaker.toLowerCase().replace(/\s+/g, '-')}${isSpecial(line.speaker) ? ' line--break' : ''}${index === shown.length - 1 ? ' is-current' : ' is-previous'}`;
      const name = document.createElement('strong');
      name.textContent = line.speaker;
      const copy = document.createElement('p');
      copy.textContent = line.text;
      item.append(name, copy);
      return item;
    }));
    requestAnimationFrame(() => {
      if (followLatest) transcript.scrollTop = transcript.scrollHeight;
    });
  }

  function showNext() {
    if (!queue.length) {
      if (phase === 'opening') return showChoices();
      if (phase === 'branch') {
        phase = 'closing';
        queue = [...source.closing];
      } else if (phase === 'closing') {
        phase = 'complete';
        hint.innerHTML = '<kbd>Enter</kbd> Replay';
        portraits.forEach(p => p.classList.remove('is-speaking', 'is-listening'));
        return;
      }
    }
    const line = queue.shift();
    shown.push(line);
    renderHistory();
    setSpeaker(line);
  }

  function showChoices() {
    phase = 'choice';
    choiceIndex = 0;
    choices.hidden = false;
    choices.innerHTML = `<p>${source.choicePrompt}</p>`;
    source.choices.forEach((choice, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = choice.text;
      button.dataset.index = index;
      button.addEventListener('pointerenter', () => selectChoice(index));
      button.addEventListener('click', () => commitChoice(index));
      choices.append(button);
    });
    selectChoice(0);
    hint.innerHTML = '<kbd>↑ ↓</kbd> Choose <span aria-hidden="true">·</span> <kbd>Enter</kbd> Confirm';
    portraits.forEach(p => p.classList.add('is-listening'));
  }

  function selectChoice(index) {
    choiceIndex = (index + source.choices.length) % source.choices.length;
    [...choices.querySelectorAll('button')].forEach((button, i) => {
      button.classList.toggle('is-selected', i === choiceIndex);
      button.setAttribute('aria-current', i === choiceIndex ? 'true' : 'false');
    });
  }

  function commitChoice(index) {
    const choice = source.choices[index];
    shown.push({speaker:'You', text:choice.text});
    phase = 'branch';
    queue = [...choice.response];
    choices.hidden = true;
    renderHistory();
    hint.innerHTML = '<kbd>Enter</kbd> Continue';
    showNext();
  }

  function reset() {
    queue = [...source.opening];
    shown = [];
    phase = 'opening';
    choices.hidden = true;
    hint.innerHTML = '<kbd>Enter</kbd> Continue';
    showNext();
    transcript.focus({preventScroll:true});
  }

  document.addEventListener('keydown', event => {
    if (isTypingTarget(event.target)) return;
    if (phase === 'choice' && ['ArrowUp','ArrowDown'].includes(event.key)) {
      event.preventDefault();
      selectChoice(choiceIndex + (event.key === 'ArrowDown' ? 1 : -1));
      return;
    }
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (phase === 'choice') commitChoice(choiceIndex);
      else if (phase === 'complete') reset();
      else showNext();
    }
  });
  document.getElementById('reset-demo').addEventListener('click', reset);
  reset();
})();

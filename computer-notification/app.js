(() => {
  const garage = document.getElementById('garage');
  const closeup = document.getElementById('closeup');
  const hotspot = document.getElementById('open-computer');
  const announcement = document.getElementById('announcement');
  const message = document.getElementById('message-window');
  const title = document.getElementById('message-title');
  const copy = document.getElementById('message-copy');
  const open = document.getElementById('open-message');
  const dismiss = document.getElementById('dismiss-message');
  const menu = document.getElementById('contacts-menu');
  const factionButtons = [...menu.querySelectorAll('[data-faction]')];
  const contacts = document.getElementById('contact-list');
  const connections = menu.querySelector('.contacts-connections');
  const screen = document.querySelector('.terminal-screen');
  const chat = document.getElementById('chat-window');
  const transcript = document.getElementById('chat-transcript');
  const choices = document.getElementById('chat-choices');
  const next = document.getElementById('chat-next');
  const status = document.getElementById('chat-status');
  const chatFooter = document.getElementById('chat-footer');
  const closeChat = document.getElementById('close-chat');
  const chatName = document.getElementById('chat-name');
  const chatFaction = document.getElementById('chat-faction');
  const portrait = closeup.querySelector('.aux-portrait');
  const vehicle = closeup.querySelector('.aux-vehicle');
  const matrix = document.getElementById('aux-matrix');
  const auxImages = closeup.querySelectorAll('.aux-portrait, .aux-vehicle');
  let matrixPattern = 0;
  for (let i = 0; i < 108; i++) {
    const square = document.createElement('i');
    square.style.setProperty('--delay', `${-((i * 7) % 19) / 10}s`);
    square.style.setProperty('--period', `${1.3 + (i % 7) * .13}s`);
    matrix.append(square);
  }
  function refreshMatrix() {
    matrixPattern++;
    [...matrix.children].forEach((square, index) => {
      const hash = ((index + 1) * 73 + matrixPattern * 101 + (index * matrixPattern * 17)) % 113;
      square.style.setProperty('--still-opacity', hash < 32 ? '.7' : hash < 55 ? '.4' : '.13');
    });
  }
  refreshMatrix();
  const names = [
    ['Robert Ball', 'Mil Rowan'],
    ['Captain William Rennick', 'Potemkin the Fish'],
    ['Unit-01', 'Unit-02'],
    ['Juniper Joy', 'River Rayne']
  ];
  const initialMessage = copy.innerHTML;
  let glitchTimer, selectedFaction = 0, activeBranch = null, selectedContact = null;
  let messageOpened = false, currentContact = 'Unit-01', unitConversation = null;
  const factions = ['Mc Inyre', 'The People M.A.R.B.L.E. Navy', 'Red Line Protocol', 'Children of the Universe'];
  const portraits = {'Robert Ball':'assets/dialogue/robert-ball.png', 'Mil Rowan':'assets/dialogue/mil-rowan.png', 'Juniper Joy':'assets/dialogue/juniper-joy.png', 'Unit-01':'assets/dialogue/unit-02.png', 'Unit-02':'assets/dialogue/unit-02.png'};
  const opening = [
    'I reviewed your last race. Your racing line was inefficient.',
    'You lost 2.4 seconds in the final sector. That is an unacceptable amount of wasted motion.',
    'Was there a reason you ignored the optimal route?'
  ];
  const replies = [
    {text: 'I took a risk to get past the traffic.', response: 'A calculated risk, then. Next time, account for the exit angle as well as the overtake.'},
    {text: 'I made a mistake. I will do better.', response: 'Acknowledged. An error is useful if you do not repeat it.'},
    {text: 'Maybe racing is not just about efficiency.', response: 'An interesting hypothesis. I will require more data before accepting it.'}
  ];
  let chatStep = 0, chatPhase = 'opening';

  function addLine(speaker, text) {
    const line = document.createElement('p');
    line.className = 'chat-line' + (speaker === 'YOU' ? ' chat-line-player' : '');
    line.dataset.speaker = speaker;
    const label = document.createElement('strong');
    label.textContent = transcript.lastElementChild?.dataset.speaker === speaker ? '' : speaker;
    if (!label.textContent) label.hidden = true;
    const body = document.createElement('span');
    body.textContent = text;
    line.append(label, body);
    transcript.append(line);
    transcript.scrollTop = transcript.scrollHeight;
  }
  function showChatChoices() {
    chatPhase = 'choice';
    choices.replaceChildren();
    replies.forEach(reply => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = reply.text;
      button.addEventListener('click', () => {
        choices.hidden = true;
        chatFooter.hidden = false;
        addLine('YOU', reply.text);
        addLine('UNIT-01', reply.response);
        chatPhase = 'closing';
        next.hidden = false;
        status.textContent = 'TRANSMISSION ACTIVE';
        next.focus();
      });
      choices.append(button);
    });
    choices.hidden = false;
    chatFooter.hidden = true;
    next.hidden = true;
    status.textContent = 'SELECT A RESPONSE';
    choices.firstElementChild.focus();
  }
  function advanceChat() {
    if (chatPhase === 'opening') {
      if (chatStep < opening.length) addLine('UNIT-01', opening[chatStep++]);
      else showChatChoices();
    } else if (chatPhase === 'closing') {
      addLine('UNIT-01', 'I will be watching your next race. Try to make every second count.');
      chatPhase = 'complete';
      status.textContent = 'TRANSMISSION ENDED';
      next.textContent = 'Close';
    } else if (chatPhase === 'complete') {
      leaveChat();
    }
  }
  function startChat(name = 'Unit-01', faction = 'Red Line Protocol') {
    refreshMatrix();
    currentContact = name;
    chatName.textContent = name.toUpperCase();
    chatFaction.textContent = ' / ' + faction.toUpperCase();
    chat.setAttribute('aria-label', 'Conversation with ' + name);
    portrait.setAttribute('aria-label', (portraits[name] ? 'Portrait of ' : 'Portrait placeholder for ') + name);
    vehicle.setAttribute('aria-label', 'Marble vehicle placeholder for ' + name);
    let portraitImage = portrait.querySelector('img');
    if (!portraitImage) { portraitImage = document.createElement('img'); portraitImage.alt = ''; portraitImage.className = 'aux-portrait-image'; portrait.append(portraitImage); }
    portraitImage.hidden = !portraits[name];
    if (portraits[name]) portraitImage.src = portraits[name];
    portraitImage.classList.toggle('unit-portrait', name === 'Unit-01' || name === 'Unit-02');
    portrait.classList.toggle('has-portrait', !!portraits[name]);
    vehicle.style.setProperty('--vehicle-hue', `${(names.flat().indexOf(name) + 1) * 28}deg`);
    closeup.classList.add('chat-active');
    auxImages.forEach(image => image.setAttribute('aria-hidden', 'false'));
    transcript.replaceChildren();
    choices.replaceChildren();
    choices.hidden = true;
    chatFooter.hidden = false;
    next.hidden = false;
    next.textContent = 'Continue ›';
    status.textContent = 'INCOMING TRANSMISSION';
    chat.hidden = false;
    if (messageOpened && name === 'Unit-01') {
      if (unitConversation) {
        chatPhase = unitConversation.phase;
        chatStep = unitConversation.step;
        transcript.replaceChildren(...unitConversation.lines);
        choices.replaceChildren(...unitConversation.options);
        choices.hidden = unitConversation.choicesHidden;
        chatFooter.hidden = !choices.hidden;
        next.hidden = unitConversation.nextHidden;
        next.textContent = unitConversation.nextText;
        status.textContent = unitConversation.status;
      } else {
        chatStep = 0;
        chatPhase = 'opening';
        advanceChat();
      }
      (choices.hidden ? next : choices.firstElementChild).focus();
    } else {
      chatPhase = 'empty';
      status.textContent = 'NO MESSAGES';
      next.hidden = true;
      closeChat.focus();
    }
  }
  function leaveChat() {
    if (messageOpened && currentContact === 'Unit-01') {
      unitConversation = {lines:[...transcript.childNodes], options:[...choices.childNodes], choicesHidden:choices.hidden, nextHidden:next.hidden, nextText:next.textContent, status:status.textContent, phase:chatPhase, step:chatStep};
    }
    refreshMatrix();
    closeup.classList.remove('chat-active');
    auxImages.forEach(image => image.setAttribute('aria-hidden', 'true'));
    chat.hidden = true;
    menu.hidden = false;
    menu.classList.remove('is-docked');
    menu.inert = false;
    renderMenu(true);
  }

  function drawConnections() {
    const columns = menu.querySelector('.contacts-columns');
    const parent = activeBranch === null ? null : factionButtons[activeBranch];
    if (!parent || menu.hidden) { connections.querySelector('path').setAttribute('d', ''); return; }
    const bounds = columns.getBoundingClientRect();
    const from = parent.getBoundingClientRect();
    const x = from.right - bounds.left, y = from.top + from.height / 2 - bounds.top;
    const path = [...contacts.querySelectorAll('button')].map(button => {
      const to = button.getBoundingClientRect();
      const endX = to.left - bounds.left, endY = to.top + to.height / 2 - bounds.top;
      const middle = x + (endX - x) / 2;
      return `M${x} ${y}H${middle}V${endY}H${endX}`;
    }).join('');
    connections.setAttribute('viewBox', `0 0 ${bounds.width} ${bounds.height}`);
    connections.querySelector('path').setAttribute('d', path);
  }
  function renderMenu(focus = false) {
    factionButtons.forEach((button, index) => button.classList.toggle('selected', selectedContact === null && index === selectedFaction));
    contacts.replaceChildren();
    if (activeBranch !== null) names[activeBranch].forEach((name, index) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.textContent = name;
      button.dataset.contact = index;
      button.classList.toggle('selected', selectedContact === index);
      contacts.append(button);
    });
    drawConnections();
    if (focus) (selectedContact === null ? factionButtons[selectedFaction] : contacts.children[selectedContact]).focus();
  }
  function reset() {
    refreshMatrix();
    clearTimeout(glitchTimer);
    screen.classList.remove('is-glitching');
    closeup.classList.remove('chat-active');
    auxImages.forEach(image => image.setAttribute('aria-hidden', 'true'));
    message.inert = false;
    chat.hidden = true;
    garage.hidden = false;
    closeup.hidden = true;
    message.hidden = false;
    menu.hidden = true;
    menu.classList.remove('is-docked');
    menu.inert = false;
    selectedFaction = 0; activeBranch = null; selectedContact = null;
    messageOpened = false; currentContact = 'Unit-01'; unitConversation = null;
    title.textContent = 'New Message';
    copy.innerHTML = initialMessage;
    open.hidden = false;
    dismiss.textContent = 'Dismiss';
    garage.classList.add('has-message');
    announcement.textContent = 'New message on the computer.';
  }
  hotspot.addEventListener('click', () => {
    garage.hidden = true;
    closeup.hidden = false;
    open.focus();
  });
  open.addEventListener('click', () => {
    messageOpened = true;
    message.inert = true;
    screen.classList.add('is-glitching');
    const delay = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 360;
    glitchTimer = setTimeout(() => {
      screen.classList.remove('is-glitching');
      message.hidden = true;
      message.inert = false;
      startChat();
    }, delay);
  });
  next.addEventListener('click', advanceChat);
  closeChat.addEventListener('click', leaveChat);
  chat.addEventListener('keydown', event => {
    if (event.key === 'Escape') { event.preventDefault(); leaveChat(); }
    if (chatPhase === 'choice' && ['ArrowUp', 'ArrowDown'].includes(event.key)) {
      event.preventDefault();
      const buttons = [...choices.querySelectorAll('button')];
      const index = buttons.indexOf(document.activeElement);
      buttons[(index + (event.key === 'ArrowDown' ? 1 : -1) + buttons.length) % buttons.length].focus();
    }
  });
  dismiss.addEventListener('click', () => {
    message.hidden = true;
    menu.hidden = false;
    renderMenu(true);
  });
  menu.addEventListener('click', event => {
    const faction = event.target.closest('[data-faction]');
    const contact = event.target.closest('[data-contact]');
    if (faction) {
      selectedFaction = Number(faction.dataset.faction);
      selectedContact = null;
      if (selectedFaction === 4) { reset(); hotspot.focus(); return; }
      activeBranch = selectedFaction;
      renderMenu(true);
    } else if (contact) {
      selectedContact = Number(contact.dataset.contact);
      const contactName = contact.textContent;
      renderMenu();
      menu.classList.add('is-docked');
      menu.inert = true;
      announcement.textContent = contactName + ' selected.';
      const factionName = factions[activeBranch];
      const delay = matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 260;
      glitchTimer = setTimeout(() => {
        menu.hidden = true;
        startChat(contactName, factionName);
      }, delay);
    }
  });
  menu.addEventListener('pointerover', event => {
    const faction = event.target.closest('[data-faction]');
    const contact = event.target.closest('[data-contact]');
    if (faction && (selectedFaction !== Number(faction.dataset.faction) || selectedContact !== null)) {
      selectedFaction = Number(faction.dataset.faction); selectedContact = null; activeBranch = null; renderMenu();
    } else if (contact && selectedContact !== Number(contact.dataset.contact)) {
      selectedContact = Number(contact.dataset.contact); renderMenu();
    }
  });
  menu.addEventListener('focusin', event => {
    const faction = event.target.closest('[data-faction]');
    const contact = event.target.closest('[data-contact]');
    if (faction && selectedFaction !== Number(faction.dataset.faction)) {
      selectedFaction = Number(faction.dataset.faction); selectedContact = null; activeBranch = null; renderMenu();
    } else if (contact) {
      selectedContact = Number(contact.dataset.contact);
      factionButtons.forEach(button => button.classList.remove('selected'));
      [...contacts.children].forEach((button, index) => button.classList.toggle('selected', index === selectedContact));
    }
  });
  menu.addEventListener('keydown', event => {
    if (['ArrowUp', 'ArrowDown'].includes(event.key)) {
      event.preventDefault();
      const delta = event.key === 'ArrowDown' ? 1 : -1;
      if (selectedContact === null) { selectedFaction = (selectedFaction + delta + 5) % 5; activeBranch = null; }
      else selectedContact = (selectedContact + delta + 2) % 2;
      renderMenu(true);
    } else if (event.key === 'ArrowRight' && activeBranch !== null && selectedContact === null) {
      event.preventDefault(); selectedContact = 0; renderMenu(true);
    } else if (['ArrowLeft', 'Escape'].includes(event.key)) {
      event.preventDefault();
      if (selectedContact !== null) selectedContact = null;
      else activeBranch = null;
      renderMenu(true);
    }
  });
  window.addEventListener('resize', drawConnections);
  document.addEventListener('click', event => {
    if (event.target.closest('button')) refreshMatrix();
  });
  document.addEventListener('focusin', event => {
    if (event.target.closest('button')) refreshMatrix();
  });
  menu.addEventListener('pointerover', event => {
    if (event.target.closest('button')) refreshMatrix();
  });
  document.getElementById('reset').addEventListener('click', reset);
  reset();
})();



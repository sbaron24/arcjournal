-- Update all 22 Major Arcana cards with essence, symbolic_language, shadows_challenges, and proper keyword arrays

-- The Fool (0)
UPDATE public.tarot_cards SET
  essence = 'The Fool represents the pure potential of new beginnings, the leap of faith into the unknown. This archetype embodies innocence, spontaneity, and the courage to start fresh without the burden of past expectations. The Fool teaches that every journey begins with a single step into uncertainty, trusting that the path will reveal itself.',
  symbolic_language = 'The cliff edge represents the threshold between known and unknown.\nThe small bundle suggests traveling light, unburdened by possessions.\nThe white rose symbolizes purity and new beginnings.\nThe dog at his heels represents loyalty and instinct guiding him.\nThe sun rising behind him illuminates the path forward, suggesting divine timing.',
  shadows_challenges = 'When the Fool energy turns shadowed, we act recklessly without consideration, mistaking naivety for wisdom. We may leap before looking, ignoring warnings and consequences. The shadow Fool refuses to learn from experience, repeating the same mistakes. The challenge is balancing spontaneity with wisdom, trusting the journey while remaining grounded.',
  keywords = ARRAY['new beginnings', 'innocent trust', 'spontaneous leap', 'faith in journey', 'fresh perspective'],
  shadow_keywords = ARRAY['reckless action', 'naive blindness', 'poor judgment', 'chaotic energy', 'refusing wisdom']
WHERE number = 0;

-- The Magician (1)
UPDATE public.tarot_cards SET
  essence = 'The Magician embodies the power of manifestation, the ability to transform intention into reality through focused will and skill. This archetype represents the bridge between the spiritual and material worlds, demonstrating that we have all the tools necessary to create our desired outcomes. The Magician teaches that true power comes from aligning thought, word, and action.',
  symbolic_language = 'The infinity symbol above represents unlimited potential and divine connection.\nThe four tools on the table symbolize the elements: air (sword), fire (wand), water (cup), earth (pentacle).\nOne hand points upward, the other downward, showing the connection between heaven and earth.\nThe red and white roses represent passion and purity, the dual nature of creation.\nThe yellow flowers symbolize intellectual clarity and communication.',
  shadows_challenges = 'When the Magician energy turns shadowed, we manipulate others for personal gain, using our skills deceptively. We may become arrogant, believing we can control everything. The shadow Magician hoards knowledge and power, refusing to share wisdom. The challenge is using our abilities ethically, manifesting for the highest good of all.',
  keywords = ARRAY['manifestation power', 'focused will', 'skillful action', 'resourceful creation', 'aligned intention'],
  shadow_keywords = ARRAY['manipulation tactics', 'deceptive control', 'ego-driven power', 'hoarding knowledge', 'unethical use']
WHERE number = 1;

-- The High Priestess (2)
UPDATE public.tarot_cards SET
  essence = 'The High Priestess represents the keeper of sacred mysteries, the gateway to intuitive wisdom and the unconscious. She embodies the power of inner knowing, the ability to access knowledge that exists beyond rational understanding. The High Priestess teaches us to trust our intuition and honor the mysteries that cannot be explained.',
  symbolic_language = 'The veil behind her represents the boundary between conscious and unconscious realms.\nThe pomegranates symbolize the seeds of hidden knowledge and the mysteries of the underworld.\nThe crescent moon at her feet connects her to cycles, intuition, and the feminine divine.\nThe scroll in her hands, partially hidden, suggests knowledge that must be earned through inner work.\nThe pillars of black and white represent the duality of existence and the balance of opposites.',
  shadows_challenges = 'When the High Priestess energy turns shadowed, we become secretive and withdrawn, hoarding knowledge instead of sharing wisdom. We may disconnect from intuition, mistrusting our inner voice. The shadow Priestess uses mystery to manipulate or control others. The challenge is balancing inner wisdom with outer expression, sharing insights while honoring the sacred.',
  keywords = ARRAY['intuitive wisdom', 'sacred mysteries', 'inner knowing', 'unconscious access', 'divine feminine'],
  shadow_keywords = ARRAY['secretive withdrawal', 'hoarding knowledge', 'disconnected intuition', 'mystery manipulation', 'repressed wisdom']
WHERE number = 2;

-- The Empress (3)
UPDATE public.tarot_cards SET
  essence = 'The Empress embodies the nurturing power of creation, the abundant flow of life, and the deep connection to nature and sensuality. This archetype represents fertility in all forms—creative, emotional, and material abundance. The Empress teaches us to honor our bodies, celebrate beauty, and trust in the natural cycles of growth and harvest.',
  symbolic_language = 'The crown of stars connects her to cosmic wisdom and divine feminine power.\nThe lush garden represents fertility, growth, and the abundance of nature.\nThe flowing river symbolizes the continuous flow of life and emotions.\nThe wheat field suggests harvest, nourishment, and the fruits of creative labor.\nThe heart-shaped shield with the Venus symbol represents love, beauty, and feminine power.',
  shadows_challenges = 'When the Empress energy turns shadowed, we become overindulgent, smothering others with excessive care. We may become dependent on external validation for our sense of worth. The shadow Empress neglects boundaries, creating codependent relationships. The challenge is nurturing without controlling, giving without losing ourselves, and finding abundance within rather than only seeking it externally.',
  keywords = ARRAY['nurturing abundance', 'creative fertility', 'natural beauty', 'sensual connection', 'material prosperity'],
  shadow_keywords = ARRAY['smothering care', 'overindulgence', 'dependency patterns', 'boundary neglect', 'external validation']
WHERE number = 3;

-- The Emperor (4)
UPDATE public.tarot_cards SET
  essence = 'The Emperor represents structure, authority, and the establishment of order through discipline and leadership. This archetype embodies the father principle, creating stability through rules, boundaries, and organized systems. The Emperor teaches us to take responsibility, establish clear structures, and lead with wisdom and fairness.',
  symbolic_language = 'The throne of stone represents solid foundation and enduring authority.\nThe ram heads symbolize Aries energy: initiative, leadership, and assertive action.\nThe scepter in hand represents power and the responsibility to rule wisely.\nThe armor suggests protection, defense, and the need to guard what we have built.\nThe barren landscape behind him shows the discipline required to maintain order.',
  shadows_challenges = 'When the Emperor energy turns shadowed, we become rigid and controlling, using authority to dominate rather than serve. We may become tyrannical, enforcing rules without compassion. The shadow Emperor fears chaos so much that we suppress all spontaneity and creativity. The challenge is balancing structure with flexibility, authority with compassion, and control with trust.',
  keywords = ARRAY['structured authority', 'disciplined leadership', 'established order', 'protective boundaries', 'wise governance'],
  shadow_keywords = ARRAY['rigid control', 'tyrannical domination', 'excessive structure', 'suppressed creativity', 'authoritarian rule']
WHERE number = 4;

-- The Hierophant (5)
UPDATE public.tarot_cards SET
  essence = 'The Hierophant represents tradition, spiritual teaching, and the transmission of established wisdom. This archetype embodies the role of spiritual teacher, connecting us to sacred traditions and helping us understand spiritual laws. The Hierophant teaches us to honor tradition while finding our own path within established structures.',
  symbolic_language = 'The triple crown represents the three realms: physical, mental, and spiritual.\nThe two keys at his feet symbolize the keys to understanding both outer and inner mysteries.\nThe crossed keys suggest the need to balance tradition with personal experience.\nThe two acolytes represent the transmission of knowledge from teacher to student.\nThe pillars suggest the structure and stability of established spiritual paths.',
  shadows_challenges = 'When the Hierophant energy turns shadowed, we become dogmatic, enforcing rigid beliefs without questioning. We may follow tradition blindly, refusing to evolve or adapt. The shadow Hierophant uses spiritual authority to control others, creating cult-like dynamics. The challenge is honoring tradition while remaining open to new understanding, teaching without indoctrinating, and finding our own authentic spiritual path.',
  keywords = ARRAY['spiritual tradition', 'sacred teaching', 'wisdom transmission', 'established beliefs', 'spiritual guidance'],
  shadow_keywords = ARRAY['dogmatic rigidity', 'blind tradition', 'spiritual control', 'indoctrination', 'unquestioned beliefs']
WHERE number = 5;

-- The Lovers (6)
UPDATE public.tarot_cards SET
  essence = 'The Lovers represents union, choice, and the alignment of values in relationships. This archetype embodies the power of conscious choice in love, the harmony that comes from authentic connection, and the integration of opposites. The Lovers teach us that true union requires both connection and individual integrity.',
  symbolic_language = 'The angel above represents divine blessing and higher guidance in relationships.\nThe two figures, one looking at the other, one looking upward, suggest the balance between human and divine love.\nThe tree of knowledge with the serpent represents the choices we make in relationships.\nThe tree of life with flames represents passion and the life force of connection.\nThe mountain in the background suggests the challenges and heights relationships can reach.',
  shadows_challenges = 'When the Lovers energy turns shadowed, we lose ourselves in relationships, becoming codependent. We may make choices based on others'' expectations rather than our own values. The shadow Lovers experience disharmony, misalignment, and the pain of unrequited or toxic love. The challenge is maintaining individual identity within union, making conscious choices, and aligning with partners who share our core values.',
  keywords = ARRAY['conscious union', 'value alignment', 'harmonious choice', 'authentic connection', 'integrated love'],
  shadow_keywords = ARRAY['codependent patterns', 'misaligned values', 'disharmonious union', 'lost identity', 'toxic connection']
WHERE number = 6;

-- The Chariot (7)
UPDATE public.tarot_cards SET
  essence = 'The Chariot represents victory through determination, willpower, and the mastery of opposing forces. This archetype embodies the power to move forward despite obstacles, using discipline and focus to achieve goals. The Chariot teaches us that success requires balancing opposing energies and maintaining control through inner strength.',
  symbolic_language = 'The two sphinxes, one black and one white, represent the opposing forces we must balance.\nThe canopy of stars suggests divine protection and cosmic guidance.\nThe laurel wreath crown represents victory and achievement.\nThe charioteer holds no reins, showing that control comes from within, not external force.\nThe city in the background represents the goals and destinations we strive toward.',
  shadows_challenges = 'When the Chariot energy turns shadowed, we become aggressive and ego-driven, forcing our way forward without consideration. We may lack direction, moving frantically without clear purpose. The shadow Chariot experiences opposition and conflict, unable to balance competing forces. The challenge is directing our willpower constructively, balancing drive with compassion, and achieving victory without crushing others.',
  keywords = ARRAY['determined victory', 'mastered willpower', 'balanced control', 'focused direction', 'disciplined achievement'],
  shadow_keywords = ARRAY['aggressive force', 'ego-driven action', 'lack of direction', 'unbalanced opposition', 'ruthless control']
WHERE number = 7;

-- Strength (8)
UPDATE public.tarot_cards SET
  essence = 'Strength represents the power of gentle mastery, the courage to face challenges with compassion, and the inner strength that comes from self-control. This archetype embodies the understanding that true strength is not about force, but about patience, compassion, and the ability to tame our inner beasts through love rather than fear.',
  symbolic_language = 'The woman gently closing the lion''s mouth represents gentle mastery over raw power.\nThe infinity symbol above her head suggests unlimited inner strength and spiritual connection.\nThe white robe symbolizes purity and the higher nature that guides strength.\nThe flowers in her hair represent the beauty and gentleness that accompanies true power.\nThe lion, tamed but not broken, shows that strength integrates rather than destroys.',
  shadows_challenges = 'When the Strength energy turns shadowed, we experience self-doubt and weakness, feeling unable to handle challenges. We may become passive, avoiding confrontation out of fear. The shadow Strength shows either excessive force or complete powerlessness. The challenge is finding the balance between aggression and passivity, developing inner confidence, and using our strength wisely and compassionately.',
  keywords = ARRAY['gentle mastery', 'compassionate courage', 'inner confidence', 'patient strength', 'loving control'],
  shadow_keywords = ARRAY['self-doubt', 'weakness', 'excessive force', 'powerlessness', 'fearful avoidance']
WHERE number = 8;

-- The Hermit (9)
UPDATE public.tarot_cards SET
  essence = 'The Hermit represents the journey inward, the search for truth through solitude and introspection. This archetype embodies the wise seeker who withdraws from the world to find inner guidance and spiritual illumination. The Hermit teaches us that sometimes we must go alone to find the answers that can only come from within.',
  symbolic_language = 'The lantern held high contains the star of inner wisdom, illuminating the path.\nThe staff represents the support and grounding needed for the inner journey.\nThe gray robe suggests the withdrawal from worldly concerns and distractions.\nThe mountain peak represents the heights of spiritual understanding.\nThe snow suggests the purity and clarity that comes from solitude.',
  shadows_challenges = 'When the Hermit energy turns shadowed, we become isolated and withdrawn, cutting ourselves off from meaningful connection. We may use solitude as an escape from facing life''s challenges. The shadow Hermit experiences loneliness and disconnection, mistaking isolation for wisdom. The challenge is balancing solitude with connection, finding inner wisdom without losing touch with the world, and sharing our insights once we have found them.',
  keywords = ARRAY['inner guidance', 'solitary wisdom', 'introspective seeking', 'spiritual illumination', 'truth discovery'],
  shadow_keywords = ARRAY['isolation', 'withdrawal', 'loneliness', 'disconnection', 'escape from life']
WHERE number = 9;

-- Wheel of Fortune (10)
UPDATE public.tarot_cards SET
  essence = 'The Wheel of Fortune represents the cycles of life, the turning of fate, and the understanding that change is the only constant. This archetype embodies the recognition that we are part of larger cycles beyond our control, and that both good and challenging times are temporary. The Wheel teaches us to flow with life''s changes rather than resist them.',
  symbolic_language = 'The wheel itself represents the eternal cycles of life, death, and rebirth.\nThe four creatures in the corners (angel, eagle, lion, bull) represent the fixed signs and the stability within change.\nThe sphinx at the top represents the mysteries of fate and the questions we cannot answer.\nThe snake descending suggests the descent into challenges and the lessons they bring.\nThe letters on the wheel (T-A-R-O) suggest the turning of the tarot itself, the cycles of understanding.',
  shadows_challenges = 'When the Wheel of Fortune energy turns shadowed, we resist change, trying to control outcomes that are beyond our influence. We may become fatalistic, believing we have no power to affect our circumstances. The shadow Wheel shows us stuck in cycles, repeating patterns without learning. The challenge is accepting change while taking responsibility for our choices, flowing with cycles while maintaining agency, and finding meaning in both the ups and downs of life.',
  keywords = ARRAY['life cycles', 'fate turning', 'change acceptance', 'destiny flow', 'karmic patterns'],
  shadow_keywords = ARRAY['resistance to change', 'fatalistic thinking', 'stuck cycles', 'powerlessness', 'chaotic change']
WHERE number = 10;

-- Justice (11)
UPDATE public.tarot_cards SET
  essence = 'Justice represents fairness, truth, and the law of cause and effect. This archetype embodies the principle that our actions have consequences, and that truth and balance will ultimately prevail. Justice teaches us to take responsibility for our choices, seek truth, and act with integrity.',
  symbolic_language = 'The scales represent the balance of truth and the weighing of evidence.\nThe sword points upward, suggesting the clarity and precision of truth.\nThe crown represents the authority of justice and the responsibility to judge fairly.\nThe red robe suggests the passion for truth and the courage to stand for what is right.\nThe pillars behind suggest the structure and foundation of justice.',
  shadows_challenges = 'When the Justice energy turns shadowed, we experience unfairness and lack of accountability. We may become judgmental, applying double standards or refusing to take responsibility for our actions. The shadow Justice shows bias, dishonesty, and the refusal to see truth. The challenge is seeking truth without self-righteousness, taking responsibility without blame, and working for justice while remaining compassionate.',
  keywords = ARRAY['truth seeking', 'fair balance', 'accountable actions', 'cause and effect', 'integrity'],
  shadow_keywords = ARRAY['unfairness', 'lack of accountability', 'bias', 'dishonesty', 'double standards']
WHERE number = 11;

-- The Hanged Man (12) - Using the existing example as reference
UPDATE public.tarot_cards SET
  essence = 'Suspended between worlds, the Hanged Man embodies the paradox of release as progress. He teaches that true movement often begins in stillness — that growth is not always forward, but inward. Through voluntary surrender, a new vantage emerges: the ability to see life not as something to master, but to meet with openness. This archetype asks you to pause long enough for wisdom to turn itself right-side up within you.',
  symbolic_language = 'The inverted figure reflects the reorientation of perception.\nThe halo of light symbolizes illumination born from surrender.\nThe tree of life represents the axis between heaven and earth — the living cross of experience.\nThe serene face reminds us that acceptance, not struggle, reveals peace.\nEvery detail of the card whispers: what you resist binds you; what you yield to transforms you.',
  shadows_challenges = 'When this energy turns shadowed, we cling to control or mistake surrender for defeat. Inaction can disguise itself as patience; victimhood can masquerade as spiritual detachment. The challenge is discerning when to let go — and when "letting go" has become avoidance. The Hanged Man calls you to surrender consciously, not passively — to participate in your own unbinding.',
  keywords = ARRAY['voluntary surrender', 'new perspective', 'stillness wisdom', 'letting go', 'inward growth'],
  shadow_keywords = ARRAY['stalling', 'needless sacrifice', 'victimhood', 'passive avoidance', 'mistaken surrender']
WHERE number = 12;

-- Death (13)
UPDATE public.tarot_cards SET
  essence = 'Death represents transformation, endings, and the inevitable change that makes way for new beginnings. This archetype embodies the understanding that all things must end for new things to begin, and that true transformation requires letting go of what no longer serves. Death teaches us that endings are not failures, but necessary transitions.',
  symbolic_language = 'The skeleton in armor represents the death of the old identity and the structures that no longer serve.\nThe black banner with the white rose suggests that death brings purity and new life.\nThe sun rising between towers represents the new dawn that follows endings.\nThe figures before Death show different reactions: the king who resists, the maiden who accepts, the child who is innocent.\nThe river in the background suggests the flow of life and the passage of time.',
  shadows_challenges = 'When the Death energy turns shadowed, we resist necessary endings, clinging to what is dying. We may fear change so much that we stagnate, refusing to let go. The shadow Death shows us stuck in grief, unable to move forward, or forcing endings prematurely. The challenge is accepting endings as natural, grieving what is lost while embracing what is to come, and recognizing that transformation, while painful, is necessary for growth.',
  keywords = ARRAY['necessary endings', 'transformation', 'letting go', 'rebirth', 'change acceptance'],
  shadow_keywords = ARRAY['resistance to change', 'stagnation', 'fear of endings', 'forced change', 'inability to move']
WHERE number = 13;

-- Temperance (14)
UPDATE public.tarot_cards SET
  essence = 'Temperance represents balance, moderation, and the alchemical process of blending opposites into harmony. This archetype embodies the understanding that true power comes from integration rather than extremes, and that patience and purpose guide us toward wholeness. Temperance teaches us to find the middle path, blending different aspects of ourselves into a unified whole.',
  symbolic_language = 'The angel mixing water between two cups represents the blending of opposites and the flow of life.\nOne foot on land, one in water, suggests the balance between the material and spiritual worlds.\nThe path leading to mountains represents the journey toward higher understanding.\nThe crown and triangle on the forehead suggest spiritual awareness and the connection to the divine.\nThe irises in the background represent messages and communication from the spiritual realm.',
  shadows_challenges = 'When the Temperance energy turns shadowed, we experience imbalance and excess, swinging between extremes. We may lack patience, rushing toward goals without proper preparation. The shadow Temperance shows us unable to integrate different aspects of ourselves, living in conflict. The challenge is finding balance without becoming stagnant, practicing moderation without losing passion, and integrating opposites while maintaining our unique identity.',
  keywords = ARRAY['balanced moderation', 'alchemical blending', 'patient integration', 'harmonious flow', 'purposeful balance'],
  shadow_keywords = ARRAY['imbalance', 'excess', 'lack of patience', 'extreme swings', 'conflicted integration']
WHERE number = 14;

-- The Devil (15)
UPDATE public.tarot_cards SET
  essence = 'The Devil represents bondage, addiction, and the chains we create through attachment to material things, beliefs, or patterns. This archetype embodies the understanding that our greatest prisons are often of our own making, and that liberation comes from recognizing and releasing our attachments. The Devil teaches us that we have the power to free ourselves from what binds us.',
  symbolic_language = 'The chained figures represent our self-imposed limitations and attachments.\nThe Devil''s pose mirrors the Lovers card, suggesting that bondage often comes from distorted love or attachment.\nThe torch pointing down represents energy directed toward the material rather than the spiritual.\nThe chains are loose, suggesting we can free ourselves if we choose.\nThe black background represents the shadow realm and the unconscious patterns that bind us.',
  shadows_challenges = 'When the Devil energy turns shadowed, we become trapped in addictions, materialism, and limiting beliefs. We may feel powerless to change, believing we have no choice. The shadow Devil shows us in bondage to others'' expectations, societal pressures, or our own fears. The challenge is recognizing our chains, taking responsibility for our bondage, and finding the courage to release what no longer serves us, even when it feels safe or familiar.',
  keywords = ARRAY['recognizing bondage', 'addiction awareness', 'material attachment', 'self-imposed chains', 'liberation potential'],
  shadow_keywords = ARRAY['addiction', 'materialism', 'limiting beliefs', 'powerlessness', 'entrapment']
WHERE number = 15;

-- The Tower (16)
UPDATE public.tarot_cards SET
  essence = 'The Tower represents sudden change, upheaval, and the lightning strike of truth that shatters false structures. This archetype embodies the understanding that sometimes our foundations must be destroyed for something truer to be built. The Tower teaches us that breakdowns can lead to breakthroughs, and that truth, however shocking, sets us free.',
  symbolic_language = 'The lightning strike represents the sudden revelation of truth that cannot be ignored.\nThe crown falling represents the collapse of false authority and ego structures.\nThe figures falling represent the release from false security and the need to let go.\nThe flames suggest the purifying power of truth and the destruction of what is false.\nThe dark clouds represent the chaos and confusion that often accompany revelation.',
  shadows_challenges = 'When the Tower energy turns shadowed, we fear change so much that we try to prevent necessary destruction, or we become overwhelmed by chaos. We may experience sudden losses without understanding their purpose. The shadow Tower shows us either resisting necessary change or being destroyed by it without learning. The challenge is accepting that some structures must fall, finding meaning in upheaval, and using breakdowns as opportunities for breakthrough and rebuilding on truer foundations.',
  keywords = ARRAY['sudden revelation', 'truth breakthrough', 'necessary destruction', 'false structure collapse', 'liberating upheaval'],
  shadow_keywords = ARRAY['fear of change', 'chaotic destruction', 'overwhelming loss', 'resistance to truth', 'ego collapse']
WHERE number = 16;

-- The Star (17)
UPDATE public.tarot_cards SET
  essence = 'The Star represents hope, healing, and renewal after the darkness of the Tower. This archetype embodies the understanding that even in our darkest moments, guidance and inspiration are available. The Star teaches us to have faith, to trust in the process of healing, and to remember that we are connected to something greater than ourselves.',
  symbolic_language = 'The large star in the center represents hope and divine guidance.\nThe seven smaller stars suggest the chakras, spiritual centers, and the connection between heaven and earth.\nThe woman pouring water represents the flow of healing and the release of what no longer serves.\nOne foot on land, one in water, suggests the balance between material and spiritual healing.\nThe bird in the tree represents the connection to nature and the messages it brings.',
  shadows_challenges = 'When the Star energy turns shadowed, we experience despair and disconnection, losing faith in the possibility of healing. We may feel abandoned, unable to see the guidance that is available. The shadow Star shows us disconnected from hope, unable to trust in renewal. The challenge is maintaining faith during dark times, opening to healing even when it seems impossible, and remembering that we are never truly alone, even when we feel disconnected.',
  keywords = ARRAY['hope', 'healing', 'renewal', 'divine guidance', 'faith'],
  shadow_keywords = ARRAY['despair', 'disconnection', 'lost faith', 'abandonment', 'disillusionment']
WHERE number = 17;

-- The Moon (18)
UPDATE public.tarot_cards SET
  essence = 'The Moon represents illusion, intuition, and the realm of dreams and shadows. This archetype embodies the understanding that not everything is as it seems, and that we must navigate the uncertain terrain between reality and illusion. The Moon teaches us to trust our intuition while remaining aware of our fears and projections.',
  symbolic_language = 'The moon phases suggest the cycles of change and the waxing and waning of understanding.\nThe path between the towers represents the journey through uncertainty and the need to trust our path.\nThe dog and wolf represent the tamed and wild aspects of our nature, both real and symbolic.\nThe crayfish emerging from water suggests the surfacing of unconscious material and hidden fears.\nThe drops falling represent the emotional and intuitive insights that come from the unconscious.',
  shadows_challenges = 'When the Moon energy turns shadowed, we become lost in illusion, unable to distinguish truth from fear. We may be overwhelmed by anxiety, confusion, and the projections of our unconscious. The shadow Moon shows us deceived, either by others or by our own fears. The challenge is navigating illusion without becoming lost, trusting intuition while questioning fear, and finding clarity in the midst of uncertainty.',
  keywords = ARRAY['intuitive navigation', 'dream wisdom', 'unconscious insight', 'illusion awareness', 'shadow integration'],
  shadow_keywords = ARRAY['confusion', 'fear', 'deception', 'anxiety', 'lost in illusion']
WHERE number = 18;

-- The Sun (19)
UPDATE public.tarot_cards SET
  essence = 'The Sun represents joy, success, and the radiant light of consciousness. This archetype embodies the understanding that after navigating the darkness of the Moon, we emerge into clarity and celebration. The Sun teaches us to celebrate life, to express ourselves authentically, and to shine our light without apology.',
  symbolic_language = 'The radiant sun represents the light of consciousness and the joy of being.\nThe child on the white horse represents innocence, freedom, and the unburdened expression of self.\nThe red banner suggests passion, vitality, and the life force.\nThe sunflowers in the background represent growth, happiness, and turning toward the light.\nThe wall behind suggests the boundaries and structures that no longer confine us.',
  shadows_challenges = 'When the Sun energy turns shadowed, we experience sadness, lack of enthusiasm, or the inability to express joy. We may become arrogant, shining so brightly that we blind others. The shadow Sun shows us either unable to access joy or using our light to overshadow others. The challenge is celebrating without arrogance, expressing joy authentically, and sharing our light while allowing others to shine.',
  keywords = ARRAY['radiant joy', 'conscious celebration', 'authentic expression', 'vital success', 'unburdened light'],
  shadow_keywords = ARRAY['sadness', 'lack of enthusiasm', 'arrogance', 'burnout', 'inability to shine']
WHERE number = 19;

-- Judgement (20)
UPDATE public.tarot_cards SET
  essence = 'Judgement represents reflection, reckoning, and the call to spiritual awakening. This archetype embodies the understanding that we are called to review our lives, to forgive ourselves and others, and to rise to a higher level of consciousness. Judgement teaches us that we have the power to transform our past through understanding and forgiveness.',
  symbolic_language = 'The angel blowing the trumpet represents the call to awakening and the announcement of transformation.\nThe figures rising from graves represent the resurrection of old patterns and the opportunity for renewal.\nThe cross on the banner suggests the integration of spiritual and material, the balance of opposites.\nThe mountains in the background represent the heights of spiritual understanding we can reach.\nThe water suggests the emotional and spiritual cleansing that comes with judgment.',
  shadows_challenges = 'When the Judgement energy turns shadowed, we become self-critical, refusing to forgive ourselves or others. We may deny the call to change, refusing to learn from our experiences. The shadow Judgement shows us stuck in the past, unable to rise, or judging others harshly. The challenge is self-reflection without self-criticism, forgiveness without denial, and answering the call to transformation while being compassionate with ourselves and others.',
  keywords = ARRAY['spiritual awakening', 'self-reflection', 'forgiveness', 'transformation call', 'renewal'],
  shadow_keywords = ARRAY['self-criticism', 'denial', 'refusal to learn', 'harsh judgment', 'stuck in past']
WHERE number = 20;

-- The World (21)
UPDATE public.tarot_cards SET
  essence = 'The World represents completion, accomplishment, and the integration of all aspects of the self into wholeness. This archetype embodies the understanding that we have completed a cycle and are ready to begin anew with greater wisdom. The World teaches us that fulfillment comes from integration, and that every ending is also a beginning.',
  symbolic_language = 'The dancer in the center represents the integration of all aspects of self and the joy of wholeness.\nThe wreath represents completion, accomplishment, and the cycle coming full circle.\nThe four figures in the corners (angel, eagle, lion, bull) represent the four elements and the integration of all aspects of being.\nThe two wands suggest the balance of opposites and the mastery achieved.\nThe clouds suggest the connection to the spiritual realm and the higher understanding gained.',
  shadows_challenges = 'When the World energy turns shadowed, we experience lack of closure, feeling incomplete despite our efforts. We may become stagnant, unable to move forward after completion. The shadow World shows us either unable to finish what we started or completing without integration. The challenge is recognizing completion, celebrating accomplishment while remaining open to new beginnings, and integrating all aspects of ourselves into wholeness without becoming complacent.',
  keywords = ARRAY['completion', 'wholeness', 'accomplishment', 'integration', 'fulfillment'],
  shadow_keywords = ARRAY['lack of closure', 'incompletion', 'stagnation', 'unfinished cycles', 'emptiness']
WHERE number = 21;


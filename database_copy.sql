--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner:
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner:
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


SET search_path = public, pg_catalog;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: active_admin_comments; Type: TABLE; Schema: public; Owner: nonche; Tablespace:
--

CREATE TABLE active_admin_comments (
    id integer NOT NULL,
    namespace character varying,
    body text,
    resource_id character varying NOT NULL,
    resource_type character varying NOT NULL,
    author_id integer,
    author_type character varying,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: active_admin_comments_id_seq; Type: SEQUENCE; Schema: public; Owner: nonche
--

CREATE SEQUENCE active_admin_comments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: active_admin_comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nonche
--

ALTER SEQUENCE active_admin_comments_id_seq OWNED BY active_admin_comments.id;


--
-- Name: admin_users; Type: TABLE; Schema: public; Owner: nonche; Tablespace:
--

CREATE TABLE admin_users (
    id integer NOT NULL,
    email character varying DEFAULT ''::character varying NOT NULL,
    encrypted_password character varying DEFAULT ''::character varying NOT NULL,
    reset_password_token character varying,
    reset_password_sent_at timestamp without time zone,
    remember_created_at timestamp without time zone,
    sign_in_count integer DEFAULT 0 NOT NULL,
    current_sign_in_at timestamp without time zone,
    last_sign_in_at timestamp without time zone,
    current_sign_in_ip character varying,
    last_sign_in_ip character varying,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: admin_users_id_seq; Type: SEQUENCE; Schema: public; Owner: nonche
--

CREATE SEQUENCE admin_users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: admin_users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nonche
--

ALTER SEQUENCE admin_users_id_seq OWNED BY admin_users.id;


--
-- Name: beer; Type: TABLE; Schema: public; Owner: nonche; Tablespace:
--

CREATE TABLE beer (
    name text,
    tags text,
    alcohol numeric(3,1),
    brewery text,
    id integer NOT NULL,
    brewery_id integer,
    image text,
    video text
);


--
-- Name: beer_id_seq; Type: SEQUENCE; Schema: public; Owner: nonche
--

CREATE SEQUENCE beer_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: beer_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nonche
--

ALTER SEQUENCE beer_id_seq OWNED BY beer.id;


--
-- Name: brewery; Type: TABLE; Schema: public; Owner: nonche; Tablespace:
--

CREATE TABLE brewery (
    id integer NOT NULL,
    name text
);


--
-- Name: brewery_id_seq; Type: SEQUENCE; Schema: public; Owner: nonche
--

CREATE SEQUENCE brewery_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: brewery_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nonche
--

ALTER SEQUENCE brewery_id_seq OWNED BY brewery.id;


--
-- Name: schema_migrations; Type: TABLE; Schema: public; Owner: nonche; Tablespace:
--

CREATE TABLE schema_migrations (
    version character varying NOT NULL
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: nonche; Tablespace:
--

CREATE TABLE users (
    id integer NOT NULL,
    email character varying DEFAULT ''::character varying NOT NULL,
    encrypted_password character varying DEFAULT ''::character varying NOT NULL,
    reset_password_token character varying,
    reset_password_sent_at timestamp without time zone,
    remember_created_at timestamp without time zone,
    sign_in_count integer DEFAULT 0 NOT NULL,
    current_sign_in_at timestamp without time zone,
    last_sign_in_at timestamp without time zone,
    current_sign_in_ip character varying,
    last_sign_in_ip character varying,
    created_at timestamp without time zone,
    updated_at timestamp without time zone
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: nonche
--

CREATE SEQUENCE users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: nonche
--

ALTER SEQUENCE users_id_seq OWNED BY users.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: nonche
--

ALTER TABLE ONLY active_admin_comments ALTER COLUMN id SET DEFAULT nextval('active_admin_comments_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: nonche
--

ALTER TABLE ONLY admin_users ALTER COLUMN id SET DEFAULT nextval('admin_users_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: nonche
--

ALTER TABLE ONLY beer ALTER COLUMN id SET DEFAULT nextval('beer_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: nonche
--

ALTER TABLE ONLY brewery ALTER COLUMN id SET DEFAULT nextval('brewery_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: nonche
--

ALTER TABLE ONLY users ALTER COLUMN id SET DEFAULT nextval('users_id_seq'::regclass);


--
-- Data for Name: active_admin_comments; Type: TABLE DATA; Schema: public; Owner: nonche
--

COPY active_admin_comments (id, namespace, body, resource_id, resource_type, author_id, author_type, created_at, updated_at) FROM stdin;
\.


--
-- Name: active_admin_comments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nonche
--

SELECT pg_catalog.setval('active_admin_comments_id_seq', 1, false);


--
-- Data for Name: admin_users; Type: TABLE DATA; Schema: public; Owner: nonche
--

COPY admin_users (id, email, encrypted_password, reset_password_token, reset_password_sent_at, remember_created_at, sign_in_count, current_sign_in_at, last_sign_in_at, current_sign_in_ip, last_sign_in_ip, created_at, updated_at) FROM stdin;
1	admin@example.com	$2a$10$j6dHZ19X5amtdBEQxldovOIuA1RszWjJxwsJe2g1Z5cDXQvBOHoNK	\N	\N	\N	0	\N	\N	\N	\N	2015-05-22 01:45:45.844034	2015-05-22 01:45:45.844034
\.


--
-- Name: admin_users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nonche
--

SELECT pg_catalog.setval('admin_users_id_seq', 1, true);


--
-- Data for Name: beer; Type: TABLE DATA; Schema: public; Owner: nonche
--

COPY beer (name, tags, alcohol, brewery, id, brewery_id, image, video) FROM stdin;
Lift Step Go	Messi, Leg Faint	3.0	Lionel Messi	10	1	messi.jpg	OKdbAHEue4c
Street Crossover	Freestyle, Street, Juggle, Trick, Panna	8.0	Palle	17	14	palle.jpg	VldFjUOQ4aU
The Okocha	Jay Jay Okocha	3.0	Jay Jay Okocha	8	5	okocha.jpg	Xp5kMTm6wnQ
Chop and Turn	\N	4.0	Christiano Ronaldo	18	3	ronaldo.jpg	1KSRGX3sW04
Falcao Dribble	Futsal	4.0	Alessandro Rosa Vieira	16	17	falcao.jpg	ULA5r4J6eno
Rivelino	Rivelino	5.0	Rivelino	23	20	rivellino.jpg	7Ahsj9PKgNY
Rabona	Rabona	6.0	Ricardo Infante	24	18	Infante.jpg	pUSFIDbiicE
Matthews	\N	3.0	Matthews	19	19	matthews.jpg	54HRpvcRn0w
Reverse Matthews	\N	4.0	Matthews	20	19	matthews.jpg	54HRpvcRn0w
Pull Back Vee	V-Move, Pullback	3.0	Ferenc Puskás	21	22	puskas.jpg	M9p9ra2Wnmg
Rainbow Kick	Rainbow Flick	7.0	Robinho	26	25	robinho.jpg	tO2IEuG_DYA
Juan Roman	\N	7.0	Juan Roman Riquelme	15	26	riquelme.jpg	IZJd_JrwKdU
Kamalio Trick	Street	9.0	Sean Garnier	32	13	garnier.jpg	3ud1rzNYKX8
Seal Dribble	\N	9.0	Kerlon	25	23	kerlon.jpg	LYlqql38XkY
Blocking Combo	Street	10.0	Olly Bowman	33	100	bowman.jpg	HH1AGsgf3Vw
Roll Heel	\N	5.0	Zinedine Zidane	28	9	zidane.jpg	E5lNZboLtwM
Zig Zag	Pele	6.0	Pele	14	16	pele.jpg	Xb6dBFndLBg
Bunny Hop	Blanco Hop, Bunny Hop	3.0	Cuauhtémoc Blanco	22	21	blanco.jpg	zFu_sw99MUU
Hip Fake	\N	1.0	George Best	12	12	georgebest.jpg	X4VPuh2puTE
Bicycle Kick	Chilena	7.0	Ramón Unzaga Asla	13	24	unzaga.jpg	jYY-I69BMjw
La Croqueta	\N	4.0	Andres Inesta	11	10	iniesta.jpg	Wq-hhEUO4eM
Fake Shot	Henry	2.0	Henry	29	15	henry.jpg	a88gvTiDQ7k
Triangle	Street, Pana	6.0	Sean Garnier	31	13	garnier.jpg	o7V5rDoyQMM
Sombrero	\N	5.0	Pele	30	16	pele.jpg	k1tKmCgF0sE
The R9	R9, Ronaldo	7.0	Ronaldo Luís Nazário de Lima	34	28	r9.jpg	qSvLSD56ZIo
R9 Air Feint	Feint, R9	6.0	Ronaldo Luís Nazário de Lima	35	28	r9.jpg	QyQglCgUols
Lucho	Figo, Luis Figo	6.0	Luis Figo	36	29	figo.jpg	y5SRou2sOjs
The Ribéry	Ribéry, Aiden McGeady	5.0	Franck Ribéry	37	30	ribery.jpg	RyfSUzwScwI
Circle	\N	3.0	Dennis Bergkamp	38	31	bergkamp.jpg	jO8Ca4f5Avs
Double Scissor	Ronaldo Scissor	2.0	Christiano Ronaldo	1	3	ronaldo.jpg	7aNeB0O4_qE
Freeze	\N	5.0	Zinedine Zidane	39	9	zidane.jpg	tglPTffdmS0
The Pele	\N	5.0	Pele	40	16	pele.jpg	ehz5x8sI7IU
The Neymar	Neymar, Signature	4.0	Neymar Junior	41	2	neymar.jpg	QdyTSR27aJk
D-Roll	droll, zidane	5.0	Zinedine Zidane	43	9	zidane.jpg	0JUfA-PkSng
Rivaldo	\N	7.0	Rivaldo Vítor Borba	44	32	rivaldo.jpg	qMmZX7oCNFE
Daze	\N	7.0	Sean Garnier	45	13	garnier.jpg	GjX0HgsPAJ0
Neymar Chip	Neymar, Signature	6.0	Neymar Junior	46	2	neymar.jpg	8aC5ZlNuIrU
Romario	Romario, Signature	5.0	Romario de Souza Faria	47	33	romario.jpg	hLO9LyjwPhA
The CR7	CR7, Ronaldo, Signature	7.0	Christiano Ronaldo	48	3	ronaldo.jpg	usINGXv0Rb0
Gerson	Ronaldinho, Signature	6.0	Ronaldinho	42	8	ronaldinho.jpg	3HKj3AvwhZQ
Elastico	Akka, Gaucho, Snake	5.0	Ronaldinho Gaucho	2	8	ronaldinho.jpg	hWOdfDdk3N0
Cruyff Turn	\N	2.0	Johan Cruyff	9	7	cruyff.jpg	CYtzf7YD8oY
La Roulette	Maradona Turn	4.0	Zinedine Zidane	4	9	zidane.jpg	nbflVPUDraU
Hocus Pocus	Aurelio, Taddei	6.0	Rodrigo Taddei	6	6	taddei.jpg	QonMb1OKgpI
Heel Chop	Ronaldo Chop, Neymar Chop	2.0	Neymar Junior	3	2	neymar.jpg	Z5v5LFJu6oo
\.


--
-- Name: beer_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nonche
--

SELECT pg_catalog.setval('beer_id_seq', 1738, true);


--
-- Data for Name: brewery; Type: TABLE DATA; Schema: public; Owner: nonche
--

COPY brewery (id, name) FROM stdin;
2	Neymar Júnior
10	Andres Iniesta
100	TODO
11	Hugo Sanchez
12	George Best
13	Séan Garnier
14	Rickard "Palle" Sjolander
15	Thierry Henry
16	Edison "Pelé" Arantes do Nascimento
17	Alessandro Rosa Vieira
18	Ricardo Infante
20	Roberto Rivellino
19	Stanley Matthews
21	Cuauhtémoc Blanco
22	Ferenc Puskás
23	Kerlon Moura Souza
24	Ramón Unzaga Asla
25	Robson "Robinho" de Souza
26	Juan Roman Riquelme
27	Olly Bowman
28	Ronaldo Luís Nazário de Lima
29	Luis Figo
5	Jay Jay Okocha
6	Rodrigo Taddei
7	Johan Cruyff
9	Zinedine Zidane
30	Franck Ribéry
31	Dennis Bergkamp
32	Rivaldo Vítor Borba
33	Romario de Souza Faria
4	Rivellino
1	Lionel Messi
3	Christiano Ronaldo
8	Ronaldinho Gaucho
\.


--
-- Name: brewery_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nonche
--

SELECT pg_catalog.setval('brewery_id_seq', 360, true);


--
-- Data for Name: schema_migrations; Type: TABLE DATA; Schema: public; Owner: nonche
--

COPY schema_migrations (version) FROM stdin;
20150522012207
20150522012209
20150522012217
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: nonche
--

COPY users (id, email, encrypted_password, reset_password_token, reset_password_sent_at, remember_created_at, sign_in_count, current_sign_in_at, last_sign_in_at, current_sign_in_ip, last_sign_in_ip, created_at, updated_at) FROM stdin;
1	admin@example.com	$2a$10$./3a2Yt8BrH3p7aqZy7DfONN52tbTkriP/cHNGY2AH0dvIQnMYY.q	\N	\N	\N	1	2015-05-22 02:17:12.798219	2015-05-22 02:17:12.798219	::1	::1	2015-05-22 01:45:45.956339	2015-05-22 02:17:12.79901
\.


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: nonche
--

SELECT pg_catalog.setval('users_id_seq', 1, true);


--
-- Name: active_admin_comments_pkey; Type: CONSTRAINT; Schema: public; Owner: nonche; Tablespace:
--

ALTER TABLE ONLY active_admin_comments
    ADD CONSTRAINT active_admin_comments_pkey PRIMARY KEY (id);


--
-- Name: admin_users_pkey; Type: CONSTRAINT; Schema: public; Owner: nonche; Tablespace:
--

ALTER TABLE ONLY admin_users
    ADD CONSTRAINT admin_users_pkey PRIMARY KEY (id);


--
-- Name: beer_pkey; Type: CONSTRAINT; Schema: public; Owner: nonche; Tablespace:
--

ALTER TABLE ONLY beer
    ADD CONSTRAINT beer_pkey PRIMARY KEY (id);


--
-- Name: brewery_pkey; Type: CONSTRAINT; Schema: public; Owner: nonche; Tablespace:
--

ALTER TABLE ONLY brewery
    ADD CONSTRAINT brewery_pkey PRIMARY KEY (id);


--
-- Name: users_pkey; Type: CONSTRAINT; Schema: public; Owner: nonche; Tablespace:
--

ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: index_active_admin_comments_on_author_type_and_author_id; Type: INDEX; Schema: public; Owner: nonche; Tablespace:
--

CREATE INDEX index_active_admin_comments_on_author_type_and_author_id ON active_admin_comments USING btree (author_type, author_id);


--
-- Name: index_active_admin_comments_on_namespace; Type: INDEX; Schema: public; Owner: nonche; Tablespace:
--

CREATE INDEX index_active_admin_comments_on_namespace ON active_admin_comments USING btree (namespace);


--
-- Name: index_active_admin_comments_on_resource_type_and_resource_id; Type: INDEX; Schema: public; Owner: nonche; Tablespace:
--

CREATE INDEX index_active_admin_comments_on_resource_type_and_resource_id ON active_admin_comments USING btree (resource_type, resource_id);


--
-- Name: index_admin_users_on_email; Type: INDEX; Schema: public; Owner: nonche; Tablespace:
--

CREATE UNIQUE INDEX index_admin_users_on_email ON admin_users USING btree (email);


--
-- Name: index_admin_users_on_reset_password_token; Type: INDEX; Schema: public; Owner: nonche; Tablespace:
--

CREATE UNIQUE INDEX index_admin_users_on_reset_password_token ON admin_users USING btree (reset_password_token);


--
-- Name: index_users_on_email; Type: INDEX; Schema: public; Owner: nonche; Tablespace:
--

CREATE UNIQUE INDEX index_users_on_email ON users USING btree (email);


--
-- Name: index_users_on_reset_password_token; Type: INDEX; Schema: public; Owner: nonche; Tablespace:
--

CREATE UNIQUE INDEX index_users_on_reset_password_token ON users USING btree (reset_password_token);


--
-- Name: unique_schema_migrations; Type: INDEX; Schema: public; Owner: nonche; Tablespace:
--

CREATE UNIQUE INDEX unique_schema_migrations ON schema_migrations USING btree (version);


--
-- Name: public; Type: ACL; Schema: -; Owner: nonche
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;

GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

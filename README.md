# NBA-Betting-Game
A website that allows user to bet on the data of NBA players. Written in Express.

# Database Model in MySQL:
CREATE TABLE player (
    player_id VARCHAR(10),
    passcode VARCHAR(15) NOT NULL,
    balance FLOAT DEFAULT 1000,
    total_stake FLOAT DEFAULT 0,
    total_gain FLOAT DEFAULT 0,
    profit_percent DECIMAL(4, 3) DEFAULT 0,
    is_golded boolean DEFAULT FALSE,
    PRIMARY KEY(player_id)
);

CREATE TABLE game (
    game_id INT AUTO_INCREMENT,
    player_id VARCHAR(10),
    stake FLOAT NOT NULL,
    gain FLOAT NOT NULL,
    FOREIGN KEY(player_id) REFERENCES player(player_id) ON DELETE CASCADE,
    PRIMARY KEY(game_id)
);

CREATE TABLE contract (
    contract_id INT UNIQUE,
    contractor_id VARCHAR(10),
    contractee_id VARCHAR(10),
    amount FLOAT,
    interest_rate DECIMAL(4, 2),
    PRIMARY KEY(contractor_id, contractee_id, contract_id),
    FOREIGN KEY(contractor_id) REFERENCES player(player_id) ON DELETE CASCADE,
    FOREIGN KEY(contractee_id) REFERENCES player(player_id) ON DELETE CASCADE
);

CREATE TABLE temp (
    message VARCHAR(10)
);

# Triggers:
DELIMITER @@
CREATE
    TRIGGER add_to_total_trigger
    BEFORE INSERT ON game
    FOR EACH ROW
BEGIN
    UPDATE player
    SET player.total_stake = player.total_stake + NEW.stake
    WHERE player.player_id = NEW.player_id;
    UPDATE player
    SET player.total_gain = player.total_gain + NEW.gain
    WHERE player.player_id = NEW.player_id;
END @@

CREATE
    TRIGGER game_trigger
    AFTER INSERT ON game
    FOR EACH ROW
BEGIN
    UPDATE player
    SET player.profit_percent = player.total_gain / player.total_stake
    WHERE player.player_id = NEW.player_id;
    UPDATE player
    SET player.balance = player.balance - NEW.stake + NEW.gain
    WHERE player.player_id = NEW.player_id;
    UPDATE player
    SET player.is_golded = (player.profit_percent > 0.499)
    WHERE player.player_id = NEW.player_id;
END @@
DELIMITER ;

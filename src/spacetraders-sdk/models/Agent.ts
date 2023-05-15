/* tslint:disable */
/* eslint-disable */
/**
 * SpaceTraders API
 * SpaceTraders is an open-universe game and learning platform that offers a set of HTTP endpoints to control a fleet of ships and explore a multiplayer universe.  The API is documented using [OpenAPI](https://github.com/SpaceTradersAPI/api-docs). You can send your first request right here in your browser to check the status of the game server.  ```json http {   \"method\": \"GET\",   \"url\": \"https://api.spacetraders.io/v2\", } ```  Unlike a traditional game, SpaceTraders does not have a first-party client or app to play the game. Instead, you can use the API to build your own client, write a script to automate your ships, or try an app built by the community.  We have a [Discord channel](https://discord.com/invite/jh6zurdWk5) where you can share your projects, ask questions, and get help from other players.   
 *
 * The version of the OpenAPI document: 2.0.0
 * Contact: joel@spacetraders.io
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { exists, mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface Agent
 */
export interface Agent {
    /**
     * 
     * @type {string}
     * @memberof Agent
     */
    accountId: string;
    /**
     * 
     * @type {string}
     * @memberof Agent
     */
    symbol: string;
    /**
     * The headquarters of the agent.
     * @type {string}
     * @memberof Agent
     */
    headquarters: string;
    /**
     * The number of credits the agent has available. Credits can be negative if funds have been overdrawn.
     * @type {number}
     * @memberof Agent
     */
    credits: number;
}

/**
 * Check if a given object implements the Agent interface.
 */
export function instanceOfAgent(value: object): boolean {
    let isInstance = true;
    isInstance = isInstance && "accountId" in value;
    isInstance = isInstance && "symbol" in value;
    isInstance = isInstance && "headquarters" in value;
    isInstance = isInstance && "credits" in value;

    return isInstance;
}

export function AgentFromJSON(json: any): Agent {
    return AgentFromJSONTyped(json, false);
}

export function AgentFromJSONTyped(json: any, ignoreDiscriminator: boolean): Agent {
    if ((json === undefined) || (json === null)) {
        return json;
    }
    return {
        
        'accountId': json['accountId'],
        'symbol': json['symbol'],
        'headquarters': json['headquarters'],
        'credits': json['credits'],
    };
}

export function AgentToJSON(value?: Agent | null): any {
    if (value === undefined) {
        return undefined;
    }
    if (value === null) {
        return null;
    }
    return {
        
        'accountId': value.accountId,
        'symbol': value.symbol,
        'headquarters': value.headquarters,
        'credits': value.credits,
    };
}


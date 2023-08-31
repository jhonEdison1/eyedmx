import { Inject, Injectable } from "@nestjs/common";
import { ConfigType } from "@nestjs/config";
import e from "express";
import config from "src/config";
import Stripe from "stripe";




@Injectable()
export class StripeService {

    private readonly stripe: Stripe;



    constructor(
        @Inject(config.KEY) private readonly configSerivce: ConfigType<typeof config>

    ) {

        this.stripe = new Stripe(this.configSerivce.stripe.secretKey, {
            apiVersion: '2023-08-16',
        });


    }



    async generatePaymentMethod(token: string) {

        const paymentMethod = await this.stripe.paymentMethods.create({
            type: 'card',
            card: { token }
        });
    
        return paymentMethod


    }



    async createPaymentIntent(amount: number, emailuser: string, paymentMethodId: string) {

        const paymentIntent = await this.stripe.paymentIntents.create({
           amount : amount * 100,           
           currency: this.configSerivce.stripe.currency,
           payment_method_types: ['card'],
           payment_method: paymentMethodId,
           description: emailuser

        });

        return paymentIntent


    

    }


    async getPaymentDetail(paymentIntentId: string) {

        const detailOrder = await this.stripe.paymentIntents.retrieve(paymentIntentId)
        return detailOrder

       

    }




}
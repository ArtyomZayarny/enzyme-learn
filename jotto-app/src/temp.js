import React from "react";
import PropTypes from "prop-types";
import toLower from "lodash/fp/toLower";
import { useIntl } from "react-intl";
import { useCreateAssetUrl } from "@haldron/hooks/use-create-asset-url";
import { ICONS, SvgIcon } from "@haldron/atomic/svg-icon";
import { CARD_BRANDS_IMAGES } from "../../../../../constants";
import { useConfig } from "@haldron/hooks/use-config";
import { WEB_CHANNELS } from "@haldron/constants";
import {
  Wrapper,
  Header,
  PaymentLabel,
  PaymentCardInfo,
  PaymentIconWrap,
  SetDefaultPaymentMethod,
  RemovePaymentMethod,
  DefaultPaymentMethod,
  PaymentMethodIcon,
  IconWrap,
  PaymentCardInfoWrap,
} from "./parts";

export const PaymentCard = ({
  card,
  isDefault,
  expired,
  removeCard,
  setAsDefaultCard,
}) => {
  const { formatMessage } = useIntl();
  const createAssetUrl = useCreateAssetUrl();

  const { digitalChannel } = useConfig();
  const isCzechBanner = digitalChannel === WEB_CHANNELS.CZ;

  const localization = {
    expires: formatMessage({
      id: "myAccount.paymentMethods.component.paymentCard.p.expires",
    }),
    expired: formatMessage({
      id: "myAccount.paymentMethods.component.paymentCard.h5.expired",
    }),
    expiredBtn: formatMessage({
      id: "myAccount.paymentMethods.component.paymentCard.button.expired",
    }),
    defaultBtn: formatMessage({
      id: "myAccount.paymentMethods.component.paymentCard.button.default",
    }),
    nonDefaultBtn: formatMessage({
      id: "myAccount.paymentMethods.component.paymentCard.button.nonDefault",
    }),
    removeBtn: formatMessage({
      id: "myAccount.paymentMethods.component.paymentCard.button.remove",
    }),
  };

  const btnText = isDefault
    ? localization.defaultBtn
    : localization.nonDefaultBtn;
  const dafaultIcon = isDefault ? (
    <SvgIcon symbol={ICONS.creditCard} />
  ) : (
    <IconWrap symbol={ICONS.creditCard} />
  );

  const current = CARD_BRANDS_IMAGES.find(
    ({ brand, pointer }) =>
      brand === toLower(card.paymentMethod) ||
      pointer.includes(toLower(card.paymentMethod))
  );
  return (
    <Wrapper
      isDefault={isDefault}
      expired={expired}
      data-testid="my-account-cards-payment-card"
    >
      <Header>
        <PaymentLabel data-testid="my-account-cards-payment-card-label">
          {!expired ? card.paymentMethod : localization.expired}
        </PaymentLabel>
        <PaymentIconWrap
          expired={expired}
          data-testid="my-account-cards-payment-card-icon"
        >
          <img
            src={isCzechBanner ? createAssetUrl(current.src) : card.icon}
            alt="payment-icon"
          />
        </PaymentIconWrap>
      </Header>
      <PaymentCardInfoWrap expired={expired}>
        <PaymentCardInfo data-testid="my-account-cards-payment-card-number">
          XXXX XXXX XXXX {card.number}
        </PaymentCardInfo>
        <PaymentCardInfo data-testid="my-account-cards-payment-card-ccowner">
          {card.ccOwner}
        </PaymentCardInfo>
        <PaymentCardInfo data-testid="my-account-cards-payment-card-expires">
          {localization.expires}{" "}
          {`${card.expiryMonth}/${card.expiryYear.slice(2)}`}
        </PaymentCardInfo>
      </PaymentCardInfoWrap>
      <SetDefaultPaymentMethod>
        <PaymentMethodIcon data-testid="my-account-cards-payment-card-set-default-icon">
          {expired ? <SvgIcon symbol={ICONS.warning} /> : dafaultIcon}
        </PaymentMethodIcon>
        <DefaultPaymentMethod
          isDefault={isDefault}
          expired={expired}
          onClick={() => {
            setAsDefaultCard(card.paymentCode, card.number, card.paymentMethod);
          }}
          disabled={isDefault || expired}
          data-testid={
            isDefault ? "my-account-cards-payment-card-set-default-button" : ""
          }
        >
          {!expired ? btnText : localization.expiredBtn}
        </DefaultPaymentMethod>
      </SetDefaultPaymentMethod>
      <RemovePaymentMethod
        onClick={() => {
          removeCard(card.paymentCode, card.paymentMethod);
        }}
        data-testid="my-account-cards-payment-card-remove-button"
      >
        {localization.removeBtn}
      </RemovePaymentMethod>
    </Wrapper>
  );
};

PaymentCard.propTypes = {
  /**
   * First card is always default
   */
  isDefault: PropTypes.bool,
  /**
   * Defined if expired date
   */
  expired: PropTypes.bool,

  /**
   * Handler to remove card
   */
  removeCard: PropTypes.func,

  /**
   * Handler to set default card
   */
  setAsDefaultCard: PropTypes.func,

  /**
   * Payment type Visa or MasterCard
   */
  paymentMethod: PropTypes.string,

  /**
   * Payment method logo
   */
  icon: PropTypes.string,

  /**
   * The last four number of cards
   */
  number: PropTypes.string,

  /**
   * The name of card owner
   */
  ccOwner: PropTypes.string,

  /**
   * Expire month of cards
   */
  expiryMonth: PropTypes.string,

  /**
   * Expire year ofcards
   */
  expiryYear: PropTypes.string,
  card: PropTypes.shape({
    paymentMethod: PropTypes.string,
    paymentCode: PropTypes.string,
    icon: PropTypes.string,
    number: PropTypes.string,
    ccOwner: PropTypes.string,
    expiryMonth: PropTypes.string,
    expiryYear: PropTypes.string,
  }),
};
